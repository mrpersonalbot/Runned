import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type View = "Side" | "Top" | "Outsole";
type Candidate = { imageUrl: string; pageUrl: string; hintText: string; index: number; score: number };
type Analyzed = Candidate & { buffer: Buffer; ratio: number; familyKey: string; edgeScore: number };
type Gallery = Record<View, Analyzed>;

const VIEWS: View[] = ["Side", "Top", "Outsole"];
const CANVAS = { width: 1200, height: 900 };
const TRUSTED_RETAILERS = ["fleetfeet.com","runningwarehouse.com","roadrunnersports.com","sportsshoes.com","misterrunning.com","runningxpert.com","holabirdsports.com","run4it.com","achillesheel.co.uk","fit2run.com","paceathletic.com","thelooprunning.com","ncrsport.com","startinglane.co.id","topscore.id","blibli.com"];
const OFFICIAL_DOMAINS: Record<string, string> = {
  adidas:"adidas.com", nike:"nike.com", asics:"asics.com", hoka:"hoka.com", "new balance":"newbalance.com", puma:"puma.com",
  saucony:"saucony.com", brooks:"brooksrunning.com", on:"on.com", mizuno:"mizunousa.com", skechers:"skechers.com",
  "910 nineten":"910.id", ortuseight:"ortuseight.com", mills:"mills.co.id",
};

function decodeHtml(value: string) {
  return value.replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replace(/\\u002[fF]/g,"/").replace(/\\u0026/g,"&").replace(/\\\//g,"/");
}
function modelTokens(brand:string, model:string) {
  return `${brand} ${model}`.toLowerCase().replace(/[^a-z0-9]+/g," ").split(/\s+/).filter((t)=>t.length>1 && !["men","mens","women","womens","shoe","shoes","running","road"].includes(t));
}
function significantTokens(tokens:string[]) { return tokens.filter((t)=>t.length>=3 && !/^v?\d+$/.test(t)); }
function variantKey(url:string) {
  const d=decodeURIComponent(url).toLowerCase();
  const p=d.match(/\/global\/([^/]+)\/([^/]+)\//); if(p) return `puma:${p[1]}:${p[2]}`;
  const a=d.match(/(\d{4}[a-z]\d{3,4})[_-](\d{3})/i); if(a) return `asics:${a[1]}-${a[2]}`;
  const h=d.match(/(?:^|\/)(\d{6,8}-[a-z0-9]+)(?:_[a-z0-9]+)?(?:[_-]0?[1-9])?\.(?:png|jpe?g|webp)/i); if(h) return `hoka:${h[1]}`;
  const n=d.match(/([a-z]{2}\d{4}-\d{3})/i); if(n) return `nike:${n[1]}`;
  const ad=d.match(/(?:^|[\/_-])([a-z]{2}\d{4})(?:[\/_\-.]|$)/i); if(ad) return `adidas:${ad[1]}`;
  const nb=d.match(/(?:^|\/)([a-z0-9]{5,12})_nb_\d{2}_i(?:\.|\?|$)/i); if(nb) return `newbalance:${nb[1]}`;
  const m=d.match(/(?:sh_)?(j\d[a-z]{2}\d{6})[_-]\d{2}/i); if(m) return `mizuno:${m[1]}`;
  const sk=d.match(/(?:^|\/)(\d{5,7})[_-]([a-z0-9]{2,6})[_-](?:\d+|\dx)/i); if(sk) return `skechers:${sk[1]}-${sk[2]}`;
  const s=d.match(/\b(s\d{5}-\d{2,4})\b/i); if(s) return `saucony:${s[1]}`;
  return null;
}
function normalizedPage(url:string) {
  try { const p=new URL(url); p.hash=""; for(const k of [...p.searchParams.keys()]) if(/utm_|ref|source|campaign|size/i.test(k)) p.searchParams.delete(k); return p.toString(); } catch { return url; }
}
function pageHost(url:string) { try { return new URL(url).hostname.toLowerCase().replace(/^www\./,""); } catch { return ""; } }
function isTrustedPage(url:string, officialDomain?:string) {
  const host=pageHost(url); if(!host) return false;
  if(officialDomain && (host===officialDomain || host.endsWith(`.${officialDomain}`))) return true;
  return TRUSTED_RETAILERS.some((d)=>host===d || host.endsWith(`.${d}`));
}
function familyKey(c:Candidate, seedKey:string|null) {
  const key=variantKey(c.imageUrl); if(seedKey && key===seedKey) return seedKey; if(key) return key;
  if(c.pageUrl) return `page:${normalizedPage(c.pageUrl)}`;
  try { const p=new URL(c.imageUrl); const stem=p.pathname.replace(/\.(?:png|jpe?g|webp|avif)$/i,"").replace(/(?:[_-](?:side|lateral|top|upper|bottom|outsole|sole|front|rear|heel|\d{1,2}|\d+x))+$/i,""); return `stem:${p.host}${stem}`; } catch { return c.imageUrl; }
}
function candidateScore(imageUrl:string,pageUrl:string,hintText:string,tokens:string[],seedKey:string|null) {
  const hay=decodeURIComponent(`${imageUrl} ${pageUrl} ${hintText}`).toLowerCase(); let score=0, matched=0;
  for(const t of tokens) if(hay.includes(t)){matched+=1; score+=t.length>=5?5:2;}
  if(tokens.length && matched/tokens.length>=.5) score+=12;
  if(/product|products|\/pd\/|shoe|running|footwear|cdn|media|images/.test(hay)) score+=3;
  if(/pinterest|ebay|amazon|aliexpress|temu|logo|icon|banner|sprite|avatar|review|video|watermark|shoe box|shoebox|packaging/.test(hay)) score-=50;
  const key=variantKey(imageUrl); if(seedKey && key===seedKey) score+=80; else if(seedKey && key && key!==seedKey) score-=120;
  return score;
}
function attr(tag:string,name:string) { const m=tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`,"i")); return decodeHtml(m?.[1]??m?.[2]??""); }
function pageMatchesModel(html:string,tokens:string[]) {
  const hay=decodeHtml(html).toLowerCase().replace(/[^a-z0-9]+/g," "); const imp=significantTokens(tokens); if(!imp.length) return true;
  return imp.filter((t)=>hay.includes(t)).length>=Math.max(1,Math.ceil(imp.length*.5));
}
function parseProductPage(html:string,baseUrl:string,tokens:string[],seedKey:string|null) {
  if(!pageMatchesModel(html,tokens)) return [] as Candidate[];
  const d=decodeHtml(html), seen=new Set<string>(), out:Candidate[]=[];
  const add=(raw:string,hint:string)=>{
    if(!raw||raw.startsWith("data:")) return;
    try {
      const cleaned=raw.replace(/^['\"]|['\"]$/g,"").replace(/\\u0026/g,"&"); const imageUrl=new URL(cleaned,baseUrl).toString();
      if(!/\.(?:png|jpe?g|webp|avif)(?:\?|$)/i.test(imageUrl) && !/(?:images\.puma|images\.asics|scene7|media\.|cdn\.|cloudinary|contentful|static-src|img\.susercontent)/i.test(imageUrl)) return;
      if(seen.has(imageUrl)) return; const score=candidateScore(imageUrl,baseUrl,hint,tokens,seedKey); if(score< -5) return;
      seen.add(imageUrl); out.push({imageUrl,pageUrl:baseUrl,hintText:decodeHtml(hint),index:out.length,score});
    } catch {}
  };
  for(const m of d.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    const tag=m[0], hint=[attr(tag,"alt"),attr(tag,"title"),attr(tag,"aria-label"),attr(tag,"data-testid"),attr(tag,"class"),attr(tag,"data-alt"),attr(tag,"data-image-role"),attr(tag,"data-view")].filter(Boolean).join(" ");
    for(const value of [attr(tag,"src"),attr(tag,"data-src"),attr(tag,"data-zoom-image"),attr(tag,"srcset"),attr(tag,"data-srcset"),attr(tag,"data-image"),attr(tag,"data-image-url")]) for(const part of value.split(/\s*,\s*/)) add(part.trim().split(/\s+/)[0]??"",hint);
  }
  for(const m of d.matchAll(/<meta\b[^>]*(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*>/gi)) add(attr(m[0],"content"),"primary product image side hero");
  const absolute=/(?:https?:)?\\?\/\\?\/[a-z0-9._~:/?#\[\]@!$&'()*+,;=%\\-]+?(?:\.png|\.jpe?g|\.webp|\.avif)(?:\?[^\s"'<>\\}]*)?/gi;
  for(const m of d.matchAll(absolute)) { const raw=m[0].replace(/\\/g,""); const i=m.index??0; add(raw.startsWith("//")?`https:${raw}`:raw,d.slice(Math.max(0,i-360),Math.min(d.length,i+m[0].length+360))); }
  const relative=/["'](\/\/(?:cdn|images|media|static)[^"']+|\/(?:cdn|media|images)\/[^"']+?\.(?:png|jpe?g|webp|avif)(?:\?[^"']*)?)["']/gi;
  for(const m of d.matchAll(relative)) { const i=m.index??0; add(m[1].startsWith("//")?`https:${m[1]}`:m[1],d.slice(Math.max(0,i-300),Math.min(d.length,i+m[0].length+300))); }
  return out.sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,90);
}
function parseBing(html:string,tokens:string[],seedKey:string|null,officialDomain?:string) {
  const out:Candidate[]=[], seen=new Set<string>();
  for(const m of html.matchAll(/\sm=(?:"([^"]+)"|'([^']+)')/gi)) {
    const raw=decodeHtml(m[1]??m[2]??""); if(!raw.includes("murl")) continue;
    try { const item=JSON.parse(raw) as {murl?:string;purl?:string;t?:string}; if(!item.murl||!/^https?:\/\//i.test(item.murl)||seen.has(item.murl)) continue; const page=item.purl??""; if(!isTrustedPage(page,officialDomain)) continue; const score=candidateScore(item.murl,page,item.t??"",tokens,seedKey); if(score<2) continue; seen.add(item.murl); out.push({imageUrl:item.murl,pageUrl:page,hintText:item.t??"",index:out.length,score}); } catch {}
  }
  return out.sort((a,b)=>b.score-a.score).slice(0,90);
}
function deterministicSeedCandidates(seed:string,tokens:string[],seedKey:string|null) {
  if(!seed||!/^https?:\/\//i.test(seed)) return [] as Candidate[]; const urls:Array<{url:string;hint:string}>=[], lower=seed.toLowerCase();
  if(lower.includes("images.puma.com")||lower.includes("images.puma.net")) { const m=seed.match(/(\/global\/[^/]+\/[^/]+\/)([^/]+)(\/fnd\/)/i); if(m){ urls.push({url:seed.replace(m[0],`${m[1]}sv01${m[3]}`),hint:"side lateral view puma sv01"},{url:seed.replace(m[0],`${m[1]}bv${m[3]}`),hint:"outsole bottom view puma bv"}); for(const code of ["sv02","sv03","sv04","sv05"]) urls.push({url:seed.replace(m[0],`${m[1]}${code}${m[3]}`),hint:`puma alternate product view ${code}`}); } }
  if(lower.includes("images.asics.com")) { const m=seed.match(/^(.*?)(?:_SR_(?:LT|RT)|_SB_TP|_SB_BT)_GLB(.*)$/i); if(m) urls.push({url:`${m[1]}_SR_RT_GLB${m[2]}`,hint:"side lateral view"},{url:`${m[1]}_SB_TP_GLB${m[2]}`,hint:"top overhead view"},{url:`${m[1]}_SB_BT_GLB${m[2]}`,hint:"outsole bottom view"}); }
  const nk=seed.match(/^(.*?)(?:PHSRH|PHSLH|PHST|PHSBT)(\d{3}[^/]*)$/i); if(nk) urls.push({url:`${nk[1]}PHSRH${nk[2]}`,hint:"side lateral view nike PHSRH"},{url:`${nk[1]}PHST${nk[2]}`,hint:"top overhead view nike PHST"},{url:`${nk[1]}PHSBT${nk[2]}`,hint:"outsole bottom view nike PHSBT"});
  const nb=seed.match(/^(.*?_nb_)\d{2}(_i(?:\.[a-z]+)?(?:\?.*)?)$/i); if(nb) for(let i=1;i<=9;i++) urls.push({url:`${nb[1]}${String(i).padStart(2,"0")}${nb[2]}`,hint:`new balance product gallery view ${i}`});
  const mz=seed.match(/^(.*?(?:SH_)?J\d[A-Z]{2}\d{6}[_-])\d{2}((?:\.[a-z]+)?(?:\?.*)?)$/i); if(mz) for(let i=1;i<=9;i++) urls.push({url:`${mz[1]}${String(i).padStart(2,"0")}${mz[2]}`,hint:`mizuno product gallery view ${i}`});
  return [...new Map(urls.map((x)=>[x.url,x])).values()].map(({url,hint},index)=>({imageUrl:url,pageUrl:"",hintText:hint,index,score:candidateScore(url,"",hint,tokens,seedKey)+50}));
}
function explicitEvidence(c:Analyzed,view:View) {
  const text=decodeURIComponent(`${c.imageUrl} ${c.hintText}`).toLowerCase(); if(/watermark|shoe box|shoebox|packaging|with box|box included/.test(text)) return -100;
  const side=/\b(side|side profile|lateral|profile|medial|outer view|inner view|side lateral center view)\b|phsrh|phslh|_sr_rt_|_sr_lt_|\/sv01\//i.test(text);
  const top=/\b(top view|top portrait view|top-down|top down|overhead|bird.?s.?eye|upper view)\b|phst|sb_tp|_tp_/i.test(text);
  const outsole=/\b(outsole|bottom view|bottom outsole|sole view|tread view)\b|phsbt|sb_bt|_bt_|\/bv\//i.test(text);
  const frontRear=/\b(front view|rear view|heel view|back view)\b/.test(text);
  if(view==="Side") return side&&!top&&!outsole&&!frontRear?30:-100; if(view==="Top") return top&&!side&&!outsole&&!frontRear?30:-100; return outsole&&!side&&!top&&!frontRear?30:-100;
}
async function computeEdge(buffer:Buffer) {
  const {data,info}=await sharp(buffer).flatten({background:"#fff"}).resize(96,96,{fit:"fill"}).greyscale().raw().toBuffer({resolveWithObject:true}); let sum=0,count=0;
  for(let y=1;y<info.height;y++) for(let x=1;x<info.width;x++){const i=y*info.width+x; sum+=Math.abs(data[i]-data[i-1])+Math.abs(data[i]-data[i-info.width]); count+=2;} return count?sum/count:0;
}
async function analyze(c:Candidate,seedKey:string|null):Promise<Analyzed> {
  const ctrl=new AbortController(), timeout=setTimeout(()=>ctrl.abort(),8000); try { const r=await fetch(c.imageUrl,{signal:ctrl.signal,headers:{"user-agent":"Mozilla/5.0 (compatible; Runned/4.0)",accept:"image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"},cache:"no-store"}); if(!r.ok) throw new Error(`image ${r.status}`); if(!(r.headers.get("content-type")??"").startsWith("image/")) throw new Error("not image"); const input=Buffer.from(await r.arrayBuffer()); const {data,info}=await sharp(input,{failOn:"none",animated:false}).rotate().flatten({background:"#fff"}).resize({width:1400,height:1400,fit:"inside",withoutEnlargement:true}).trim({background:"#fff",threshold:18}).png().toBuffer({resolveWithObject:true}); return {...c,buffer:data,ratio:(info.width||1)/(info.height||1),familyKey:familyKey(c,seedKey),edgeScore:await computeEdge(data)}; } finally { clearTimeout(timeout); }
}
async function analyzeMany(candidates:Candidate[],seedKey:string|null,limit=36) { const selected=candidates.slice(0,limit), out:Analyzed[]=[]; for(let i=0;i<selected.length;i+=8){const settled=await Promise.allSettled(selected.slice(i,i+8).map((c)=>analyze(c,seedKey))); out.push(...settled.flatMap((x)=>x.status==="fulfilled"?[x.value]:[]));} return out; }
function chooseGallery(images:Analyzed[],seedKey:string|null):Gallery|null {
  const groups=new Map<string,Analyzed[]>(); for(const image of images){const g=groups.get(image.familyKey)??[];g.push(image);groups.set(image.familyKey,g);} let best:{gallery:Gallery;score:number}|null=null;
  for(const [key,group] of groups){if(group.length<3) continue; const selected={} as Gallery, used=new Set<string>(); let total=key===seedKey?120:0;
    const es=group.filter((x)=>explicitEvidence(x,"Side")>=30).sort((a,b)=>b.score-a.score||b.ratio-a.ratio)[0]; const vs=group.filter((x)=>x.ratio>=1.18).sort((a,b)=>b.ratio-a.ratio||b.score-a.score)[0]; const side=es??vs; if(!side) continue; selected.Side=side;used.add(side.imageUrl);total+=(es?35:20)+side.score;
    const et=group.filter((x)=>!used.has(x.imageUrl)&&explicitEvidence(x,"Top")>=30).sort((a,b)=>b.score-a.score)[0]; const eo=group.filter((x)=>!used.has(x.imageUrl)&&explicitEvidence(x,"Outsole")>=30).sort((a,b)=>b.score-a.score)[0];
    if(et){selected.Top=et;used.add(et.imageUrl);total+=35+et.score;} if(eo&&!used.has(eo.imageUrl)){selected.Outsole=eo;used.add(eo.imageUrl);total+=35+eo.score;}
    const portrait=group.filter((x)=>!used.has(x.imageUrl)&&x.ratio>=.28&&x.ratio<=.82).sort((a,b)=>b.score-a.score);
    if(!selected.Top||!selected.Outsole){if(portrait.length<Number(!selected.Top)+Number(!selected.Outsole)) continue; const textured=[...portrait].sort((a,b)=>a.edgeScore-b.edgeScore); if(!selected.Top){selected.Top=textured[0];used.add(textured[0].imageUrl);total+=18+textured[0].score;} if(!selected.Outsole){const rem=textured.filter((x)=>!used.has(x.imageUrl));if(!rem.length) continue;const outsole=rem[rem.length-1];if(!eo&&outsole.edgeScore<selected.Top.edgeScore*1.04) continue;selected.Outsole=outsole;used.add(outsole.imageUrl);total+=18+outsole.score;}}
    if(new Set(VIEWS.map((v)=>selected[v]?.imageUrl)).size!==3) continue; if(new Set(VIEWS.map((v)=>selected[v]?.familyKey)).size!==1) continue; if(!best||total>best.score) best={gallery:selected,score:total};
  } return best?.gallery??null;
}
async function deterministicGalleryFromCandidates(candidates:Candidate[],tokens:string[],seedKey:string|null){for(const c of candidates.slice(0,28)){const dk=variantKey(c.imageUrl)??seedKey, derived=deterministicSeedCandidates(c.imageUrl,tokens,dk);if(derived.length<3) continue;const g=chooseGallery(await analyzeMany(derived,dk,14),dk);if(g)return g;}return null;}
async function fetchHtml(url:string){const ctrl=new AbortController(),timeout=setTimeout(()=>ctrl.abort(),10000);try{const r=await fetch(url,{signal:ctrl.signal,headers:{"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"},cache:"no-store"});if(!r.ok||!(r.headers.get("content-type")??"").includes("text/html"))return null;return await r.text();}catch{return null;}finally{clearTimeout(timeout);}}
async function galleryFromPage(url:string,tokens:string[],seedKey:string|null){const html=await fetchHtml(url);if(!html)return null;const c=parseProductPage(html,url,tokens,seedKey);if(!c.length)return null;const d=await deterministicGalleryFromCandidates(c,tokens,seedKey);if(d)return d;return chooseGallery(await analyzeMany(c,seedKey,56),seedKey);}
async function searchCandidates(query:string,tokens:string[],seedKey:string|null,officialDomain?:string){const r=await fetch(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC3`,{headers:{"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36"},cache:"no-store"});if(!r.ok)return[] as Candidate[];return parseBing(await r.text(),tokens,seedKey,officialDomain);}
async function galleryFromSearch(query:string,tokens:string[],seedKey:string|null,officialDomain?:string){const s=await searchCandidates(query,tokens,seedKey,officialDomain);if(!s.length)return null;const d=await deterministicGalleryFromCandidates(s,tokens,seedKey);if(d)return{gallery:d,pageUrl:"deterministic-search"};for(const page of [...new Set(s.map((c)=>c.pageUrl).filter(Boolean))].slice(0,8)){const g=await galleryFromPage(page,tokens,seedKey);if(g)return{gallery:g,pageUrl:page};}const direct=chooseGallery(await analyzeMany(s,seedKey,42),seedKey);if(direct)return{gallery:direct,pageUrl:direct.Side.pageUrl||direct.Top.pageUrl||direct.Outsole.pageUrl};return null;}
async function resolveGallery(brand:string,model:string,source:string,seed:string){const tokens=modelTokens(brand,model), seedKey=variantKey(seed), official=OFFICIAL_DOMAINS[brand.toLowerCase()];const d=deterministicSeedCandidates(seed,tokens,seedKey);if(d.length>=3){const g=chooseGallery(await analyzeMany(d,seedKey,14),seedKey);if(g)return{gallery:g,pageUrl:"deterministic-seed"};}if(source&&/^https?:\/\//i.test(source)){const g=await galleryFromPage(source,tokens,seedKey);if(g)return{gallery:g,pageUrl:source};}if(official){const g=await galleryFromSearch(`site:${official} \"${brand} ${model}\" running shoes`,tokens,seedKey,official);if(g)return g;}for(const domain of ["fleetfeet.com","runningwarehouse.com","run4it.com","holabirdsports.com","paceathletic.com"]){const g=await galleryFromSearch(`site:${domain} \"${brand} ${model}\"`,tokens,seedKey,official);if(g)return g;}return galleryFromSearch(`\"${brand} ${model}\" running shoes side top outsole`,tokens,seedKey,official);}
async function normalize(buffer:Buffer,view:View){const target=view==="Side"?{width:1000,height:620}:{width:720,height:800};const object=await sharp(buffer).flatten({background:"#fff"}).trim({background:"#fff",threshold:18}).resize({...target,fit:"contain",background:"#fff",withoutEnlargement:true}).png({compressionLevel:9}).toBuffer();const meta=await sharp(object).metadata(),w=meta.width??target.width,h=meta.height??target.height;return sharp({create:{width:CANVAS.width,height:CANVAS.height,channels:4,background:"#fff"}}).composite([{input:object,left:Math.floor((CANVAS.width-w)/2),top:Math.floor((CANVAS.height-h)/2)}]).png({compressionLevel:9}).toBuffer();}
function verificationMethod(image:Analyzed,view:View){return explicitEvidence(image,view)>=30?"metadata":"pixel-shape-texture";}

export async function GET(request:NextRequest){const brand=request.nextUrl.searchParams.get("brand")?.trim()??"",model=request.nextUrl.searchParams.get("model")?.trim()??"",view=request.nextUrl.searchParams.get("view") as View|null,source=request.nextUrl.searchParams.get("source")?.trim()??"",seed=request.nextUrl.searchParams.get("seed")?.trim()??"";if(!brand||!model||!view||!VIEWS.includes(view))return new Response("Invalid shoe image request",{status:400});try{const resolved=await resolveGallery(brand,model,source,seed);if(!resolved)throw new Error("no verified single-family Side/Top/Outsole gallery");const picked=resolved.gallery[view],output=await normalize(picked.buffer,view),method=verificationMethod(picked,view);return new Response(new Uint8Array(output),{status:200,headers:{"content-type":"image/png","cache-control":"public, max-age=604800, s-maxage=2592000, stale-while-revalidate=604800","x-runned-gallery-page":resolved.pageUrl,"x-runned-image-family":picked.familyKey,"x-runned-image-candidate":picked.imageUrl,"x-runned-image-view":view,"x-runned-angle-evidence":method==="metadata"?"30":"20","x-runned-verification-method":method,"x-runned-edge-score":picked.edgeScore.toFixed(3)}});}catch(error){console.error("Strict shoe image resolution rejected",{brand,model,view,source,seed,error});return new Response("No verified three-view gallery available",{status:422,headers:{"cache-control":"public, max-age=900, s-maxage=900"}});}}
