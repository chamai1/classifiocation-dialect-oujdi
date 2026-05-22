import { useState, useRef, useEffect } from "react";

const M = {
  50:"#EEEDFE",100:"#CECBF6",200:"#AFA9EC",300:"#9590E4",
  400:"#7F77DD",500:"#6A62D0",600:"#534AB7",700:"#453D9E",
  800:"#3C3489",900:"#26215C",950:"#0e0c24",
};

const COMPARISON = [
  {concept:"الآن / maintenant",   oujdi:"دروك",      darija:"دابا"},
  {concept:"كثيراً / beaucoup",   oujdi:"عكود",      darija:"بزاف"},
  {concept:"نعم / oui",           oujdi:"واه",        darija:"إيه / آه"},
  {concept:"بعدها / après",       oujdi:"مور",        darija:"من بعد"},
  {concept:"بسرعة / vite",        oujdi:"فيسع",       darija:"بسرعة"},
  {concept:"اسأل / demande",      oujdi:"سقسي",       darija:"سول"},
  {concept:"هكذا / comme ça",     oujdi:"هاكاك",      darija:"هكذاك"},
  {concept:"هادئ / calme",        oujdi:"ريض",        darija:"هادئ"},
  {concept:"شوف / regarde",       oujdi:"خازر",       darija:"شوف"},
  {concept:"اجلس / assieds-toi",  oujdi:"اقعد",       darija:"اجلس"},
  {concept:"الشباكية / chebakia", oujdi:"الزلابية",   darija:"الشباكية"},
  {concept:"حسن / bien",          oujdi:"مليح",       darija:"مزيان"},
  {concept:"روح / va",            oujdi:"رواح",       darija:"روح"},
  {concept:"أمي / maman",         oujdi:"الواليدة",   darija:"ماما"},
  {concept:"أبي / papa",          oujdi:"الوالد",     darija:"البا / بابا"},
  {concept:"أخي / mon frère",     oujdi:"خويا",       darija:"خويا / خوي"},
  {concept:"الآن/tout de suite",  oujdi:"دروك دروك",  darija:"دابا دابا"},
  {concept:"ذهب / parti",         oujdi:"مضى",        darija:"مشا"},
  {concept:"تعال / viens",        oujdi:"أجي",        darija:"أجي / عيّط"},
  {concept:"السوق / marché",      oujdi:"السوق",      darija:"الحانوت"},
];

const OUJDI_MARKERS = ["دروك","عكود","واه","مور","فيسع","سقسي","ريض","هاكاك","رواح","نخازر","نقعد","زلابية","واليدة","الوالد","مليح"];
const DARIJA_MARKERS = ["دابا","واخا","بزاف","مزيان","كيفاش","فاش","علاش","شنو","فين","راه","باش","غير","ماشي","هادي","كنمشي","كنشوف","ماما"];

const dCol = (d) => d === "oujdi"
  ? {bg:`${M[600]}18`, border:"#a78bfa", text:"#c4b5fd", dot:"#a78bfa", glow:"#7c3aed"}
  : {bg:`#05966918`,   border:"#10b981", text:"#6ee7b7", dot:"#10b981", glow:"#059669"};

function Spinner() {
  return (
    <div style={{display:"flex",gap:5,alignItems:"center",justifyContent:"center",padding:"4px 0"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{width:7,height:7,borderRadius:"50%",background:M[400],
          animation:`bounce 1.1s ease-in-out ${i*0.18}s infinite`}}/>
      ))}
    </div>
  );
}

function ResultCard({result}) {
  if (!result) return null;

  const col     = dCol(result.prediction);
  const oPct    = result.confidence?.oujdi  ?? 0;
  const dPct    = result.confidence?.darija ?? 0;
  const winner  = Math.max(oPct, dPct);
  const isOujdi = result.prediction === "oujdi";

  return (
    <div style={{
      borderRadius:20, overflow:"hidden",
      border:`1px solid ${col.border}44`,
      boxShadow:`0 16px 56px ${col.glow}28`,
      animation:"fadeUp .4s cubic-bezier(.22,1,.36,1)",
    }}>
      <div style={{
        padding:"32px 32px 26px",
        background:`linear-gradient(135deg,${col.bg},${M[900]}88)`,
        borderBottom:`1px solid ${col.border}22`,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:18}}>
          <div style={{
            width:60,height:60,borderRadius:18,flexShrink:0,
            background:`linear-gradient(135deg,${col.border}33,${col.border}11)`,
            border:`1px solid ${col.border}55`,
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke={col.border} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {isOujdi
                ? <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                : <><circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12 15.3 15.3 0 0 1 12 2z"/></>
              }
            </svg>
          </div>

          <div>
            <div style={{fontSize:11,color:`${M[300]}77`,textTransform:"uppercase",letterSpacing:1.4,marginBottom:5}}>
              Dialecte détecté
            </div>
            <div style={{fontSize:28,fontWeight:900,color:col.text,letterSpacing:-.8,lineHeight:1}}>
              {isOujdi ? "الوجدية" : "الدارجة"}
            </div>
            <div style={{fontSize:13,color:`${col.text}77`,marginTop:4}}>
              {isOujdi ? "Oujdi · وجدة" : "Darija · المغربية"}
            </div>
          </div>
        </div>

        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{
            fontSize:64,fontWeight:900,lineHeight:1,letterSpacing:-3,
            background:`linear-gradient(135deg,#fff 30%,${col.text})`,
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
          }}>
            {winner.toFixed(1)}<span style={{fontSize:32}}>%</span>
          </div>
          <div style={{fontSize:12,color:`${M[300]}55`,marginTop:4,textAlign:"right"}}>confiance</div>
        </div>
      </div>

      <div style={{padding:"24px 32px 28px",background:`${M[900]}55`}}>
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#a78bfa",
                boxShadow:"0 0 10px #a78bfa88",flexShrink:0}}/>
              <span style={{fontSize:15,fontWeight:700,color:"#c4b5fd"}}>الوجدية / Oujdi</span>
            </div>
            <span style={{fontSize:28,fontWeight:900,color:"#c4b5fd",letterSpacing:-1,
              minWidth:80,textAlign:"right",lineHeight:1}}>
              {oPct.toFixed(1)}<span style={{fontSize:16}}>%</span>
            </span>
          </div>
          <div style={{height:12,borderRadius:99,background:`${M[800]}99`,overflow:"hidden"}}>
            <div style={{
              height:"100%",width:`${oPct}%`,borderRadius:99,
              background:"linear-gradient(90deg,#7c3aed,#a78bfa,#c4b5fd)",
              transition:"width .9s cubic-bezier(.22,1,.36,1)",
              boxShadow:"0 0 16px #a78bfa66",
            }}/>
          </div>
        </div>

        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:9,height:9,borderRadius:"50%",background:"#10b981",
                boxShadow:"0 0 10px #10b98188",flexShrink:0}}/>
              <span style={{fontSize:15,fontWeight:700,color:"#6ee7b7"}}>الدارجة / Darija</span>
            </div>
            <span style={{fontSize:28,fontWeight:900,color:"#6ee7b7",letterSpacing:-1,
              minWidth:80,textAlign:"right",lineHeight:1}}>
              {dPct.toFixed(1)}<span style={{fontSize:16}}>%</span>
            </span>
          </div>
          <div style={{height:12,borderRadius:99,background:`${M[800]}99`,overflow:"hidden"}}>
            <div style={{
              height:"100%",width:`${dPct}%`,borderRadius:99,
              background:"linear-gradient(90deg,#059669,#10b981,#6ee7b7)",
              transition:"width .9s cubic-bezier(.22,1,.36,1)",
              boxShadow:"0 0 16px #10b98166",
            }}/>
          </div>
        </div>

        {result.markers?.length > 0 && (
          <div style={{marginTop:22,paddingTop:18,borderTop:`1px solid ${M[700]}44`}}>
            <div style={{fontSize:11,color:`${M[300]}55`,textTransform:"uppercase",
              letterSpacing:.9,marginBottom:10}}>
              Marqueurs détectés
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {result.markers.map((m,i)=>(
                <span key={i} style={{
                  padding:"5px 14px",borderRadius:20,fontSize:14,fontWeight:700,
                  background:`${col.border}18`,border:`1px solid ${col.border}44`,
                  color:col.text,direction:"rtl",
                }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        {result.fallback && (
          <div style={{marginTop:14,fontSize:11,color:`${M[400]}66`,textAlign:"center"}}>
            ⚠️ Estimation hors-ligne — lancer le backend LoRA
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClassifierPage() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab,     setTab]     = useState("classifier");
  const [history, setHistory] = useState([]);
  const [apiOk,   setApiOk]   = useState(null);
  const [lexSearch, setLexSearch] = useState("");
  const taRef = useRef(null);

  useEffect(()=>{
    fetch("http://127.0.0.1:5001/health",{signal:AbortSignal.timeout(2000)})
      .then(()=>setApiOk(true))
      .catch(()=>setApiOk(false));
  },[]);

  const classify = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setResult(null);

    const markers = [...OUJDI_MARKERS,...DARIJA_MARKERS].filter(m=>text.includes(m));

    try {
      const res  = await fetch("http://127.0.0.1:5001/classify",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text}),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();

      const r = {
        prediction: data.label === "moroccan" ? "darija" : data.label,
        confidence: {
          oujdi: (data.probabilities?.oujdi ?? 0) * 100,
          darija: (data.probabilities?.moroccan ?? 0) * 100,
        },
        markers,
        raw: data,
      };

      setResult(r);
      setHistory(h => [
        { text: text.slice(0, 55), ...r, time: Date.now() },
        ...h.slice(0, 7)
      ]);

    } catch {
      const oC    = OUJDI_MARKERS.filter(m=>text.includes(m)).length;
      const dC    = DARIJA_MARKERS.filter(m=>text.includes(m)).length;
      const total = oC + dC || 1;
      const oP    = Math.round((oC/total)*100);
      const pred  = oP >= 50 ? "oujdi" : "darija";
      const r = {prediction:pred, confidence:{oujdi:oP,darija:100-oP}, markers, fallback:true};

      setResult(r);
      setHistory(h=>[{text:text.slice(0,55),...r,time:Date.now()},...h.slice(0,7)]);
    } finally {
      setLoading(false);
    }
  };

  const TABS = [
    {id:"classifier", label:"Classifier",
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>},
    {id:"lexique", label:"Lexique",
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>},
  ];

  const filteredLex = COMPARISON.filter(r=>
    !lexSearch ||
    r.concept.toLowerCase().includes(lexSearch.toLowerCase()) ||
    r.oujdi.includes(lexSearch) ||
    r.darija.includes(lexSearch)
  );

  return (
    <div style={{
      display:"flex",minHeight:"100vh",
      background:`linear-gradient(160deg,${M[900]} 0%,#070816 100%)`,
      fontFamily:"'Outfit','Segoe UI',system-ui,sans-serif",
      color:"#fff",overflow:"hidden",position:"relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::placeholder{color:#453D9E55;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:#453D9E88;border-radius:99px;}
        textarea,button,input{font-family:'Outfit','Segoe UI',system-ui,sans-serif;}
        textarea{resize:none;}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-7px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 #6A62D077;}70%{box-shadow:0 0 0 12px #6A62D000;}100%{box-shadow:0 0 0 0 #6A62D000;}}
        .sb-ic:hover{background:#453D9E22!important;color:#AFA9EC!important;}
        .hist-item:hover{background:#3C348855!important;}
        .lex-row:hover .lex-cell{background:#3C348844!important;}
        .cta{transition:all .25s cubic-bezier(.22,1,.36,1);}
        .cta:hover:not(:disabled){transform:translateY(-2px) scale(1.015);box-shadow:0 14px 40px #6A62D088!important;}
        .cta:active:not(:disabled){transform:scale(.98);}
        .tab-pill:hover{background:#453D9E33!important;color:#AFA9EC!important;}
      `}</style>

      <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.05}}>
        <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#7F77DD" strokeWidth=".5"/>
        </pattern></defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
      </svg>

      <div style={{position:"fixed",top:-200,right:-100,width:600,height:600,background:"radial-gradient(circle,#453D9E15 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",bottom:-150,left:0,width:400,height:400,background:"radial-gradient(circle,#534AB722 0%,transparent 70%)",pointerEvents:"none",zIndex:0}}/>

      <div style={{width:56,flexShrink:0,zIndex:10,background:"#0a0818",
        borderRight:`1px solid ${M[800]}44`,
        display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 0",gap:4}}>
        <div style={{width:36,height:36,borderRadius:9,marginBottom:14,cursor:"pointer",
          background:`linear-gradient(135deg,${M[500]},${M[400]})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 4px 16px ${M[600]}66`,animation:"pulse-ring 2.6s ease-in-out infinite"}}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
          </svg>
        </div>

        {TABS.map(t=>(
          <div key={t.id} className="sb-ic" onClick={()=>setTab(t.id)} title={t.label} style={{
            width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",
            borderRadius:10,cursor:"pointer",transition:"all .18s",
            background:tab===t.id?`${M[500]}33`:"transparent",
            borderLeft:tab===t.id?`2px solid ${M[400]}`:"2px solid transparent",
            color:tab===t.id?M[300]:`${M[300]}55`,
          }}>{t.icon}</div>
        ))}

        <div style={{flex:1}}/>

        <div style={{marginBottom:14,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{width:7,height:7,borderRadius:"50%",
            background:apiOk===null?M[400]:apiOk?"#4ade80":"#f87171",
            boxShadow:`0 0 7px ${apiOk===null?M[400]:apiOk?"#4ade80":"#f87171"}`}}/>
          <span style={{fontSize:8,color:`${M[300]}44`,writingMode:"vertical-rl",
            transform:"rotate(180deg)",letterSpacing:.5}}>
            {apiOk===null?"...":apiOk?"LIVE":"LOCAL"}
          </span>
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"13px 28px",borderBottom:`1px solid ${M[800]}44`,
          background:`${M[950]}cc`,backdropFilter:"blur(14px)"}}>
          <div>
            <h1 style={{fontSize:17,fontWeight:800,letterSpacing:-.4,margin:0}}>
              wajdi<span style={{color:M[400]}}>classify</span>
              <span style={{color:M[500],fontSize:12,fontWeight:400}}>.ai</span>
            </h1>
            <p style={{fontSize:11,color:`${M[300]}55`,margin:0,marginTop:1}}>
              Darija ⟷ Oujdi · DistilBERT + LoRA
            </p>
          </div>

          <div style={{display:"flex",gap:6}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} className="tab-pill" style={{
                padding:"7px 18px",borderRadius:9,border:"none",cursor:"pointer",
                background:tab===t.id?`linear-gradient(135deg,${M[600]},${M[500]})`:`${M[800]}55`,
                color:tab===t.id?"#fff":`${M[200]}77`,
                fontSize:13,fontWeight:tab===t.id?600:400,transition:"all .2s",
                display:"flex",alignItems:"center",gap:7,
              }}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"32px 28px"}}>
          {tab==="classifier" && (
            <div style={{maxWidth:1000,margin:"0 auto"}}>
              <div style={{marginBottom:28,textAlign:"center"}}>
                <div style={{display:"inline-flex",alignItems:"center",gap:8,
                  background:`${M[800]}66`,border:`1px solid ${M[600]}44`,
                  borderRadius:20,padding:"5px 16px",marginBottom:14,fontSize:12,color:M[300]}}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>
                  DistilBERT + LoRA · checkpoint-20000 · 100K échantillons
                </div>

                <h2 style={{fontSize:"clamp(1.8rem,3vw,2.6rem)",fontWeight:900,letterSpacing:-1.5,margin:"0 0 8px",
                  background:`linear-gradient(135deg,#fff 0%,${M[200]} 50%,${M[400]} 100%)`,
                  backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                  animation:"shimmer 5s linear infinite"}}>
                  Classification Dialectale
                </h2>

                <p style={{fontSize:15,color:`${M[200]}66`,fontWeight:300,maxWidth:500,margin:"0 auto"}}>
                  Entrez votre texte — le modèle détecte automatiquement s'il s'agit de <strong style={{color:"#c4b5fd"}}>Oujdi</strong> ou de <strong style={{color:"#6ee7b7"}}>Darija</strong>
                </p>
              </div>

              <div style={{maxWidth:660,margin:"0 auto 28px"}}>
                <div style={{
                  background:`${M[900]}88`,border:`1px solid ${M[700]}55`,
                  borderRadius:20,padding:24,backdropFilter:"blur(8px)",
                }}>
                  <div style={{
                    background:`${M[800]}55`,border:`1px solid ${M[600]}44`,
                    borderRadius:14,overflow:"hidden",marginBottom:16,
                  }}>
                    <textarea
                      ref={taRef}
                      value={text}
                      onChange={e=>setText(e.target.value)}
                      onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey)classify();}}
                      placeholder="اكتب هنا بالدارجة أو الوجدية…"
                      rows={4}
                      dir="rtl"
                      style={{width:"100%",padding:"18px 20px",background:"transparent",
                        border:"none",outline:"none",color:"#fff",fontSize:18,lineHeight:1.8,
                        letterSpacing:.2}}
                    />

                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                      padding:"8px 16px",borderTop:`1px solid ${M[700]}33`}}>
                      <span style={{fontSize:11,color:`${M[400]}55`}}>
                        {text.length} car. · Ctrl+Entrée pour analyser
                      </span>
                      {text && (
                        <button onClick={()=>{setText("");setResult(null);}}
                          style={{background:"transparent",border:"none",color:`${M[300]}55`,
                            cursor:"pointer",fontSize:13,padding:"2px 6px"}}>
                          ✕ effacer
                        </button>
                      )}
                    </div>
                  </div>

                  <button onClick={classify} disabled={loading||!text.trim()} className="cta"
                    style={{width:"100%",padding:"15px",border:"none",borderRadius:13,
                      color:"#fff",fontWeight:700,fontSize:16,
                      cursor:loading||!text.trim()?"not-allowed":"pointer",
                      background:loading||!text.trim()
                        ?`${M[700]}44`
                        :`linear-gradient(135deg,${M[600]},${M[500]},${M[400]})`,
                      backgroundSize:"200% auto",
                      boxShadow:loading||!text.trim()?"none":`0 6px 28px ${M[600]}55`,
                      animation:loading||!text.trim()?"none":"shimmer 3s linear infinite",
                      display:"flex",alignItems:"center",justifyContent:"center",gap:9}}>
                    {loading ? <Spinner/> : (
                      <>
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
                        </svg>
                        Analyser le dialecte
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div style={{maxWidth:660,margin:"0 auto"}}>
                {result
                  ? <ResultCard result={result}/>
                  : (
                    <div style={{
                      background:`${M[900]}44`,border:`1px dashed ${M[700]}44`,
                      borderRadius:20,padding:36,
                      display:"flex",flexDirection:"column",alignItems:"center",
                      justifyContent:"center",gap:12,color:`${M[400]}55`,textAlign:"center",
                    }}>
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" style={{opacity:.3}}>
                        <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
                      </svg>
                      <div>
                        <p style={{fontSize:15,margin:0,color:`${M[300]}55`,fontWeight:500}}>Le résultat apparaîtra ici</p>
                        <p style={{fontSize:13,margin:"5px 0 0",color:`${M[300]}33`}}>
                          avec le % Oujdi et % Darija
                        </p>
                      </div>
                    </div>
                  )
                }

                {history.length > 0 && (
                  <div style={{marginTop:24}}>
                    <div style={{fontSize:11,color:`${M[300]}44`,textTransform:"uppercase",
                      letterSpacing:.9,marginBottom:8}}>Historique</div>
                    <div style={{display:"flex",flexDirection:"column",gap:5}}>
                      {history.map((h,i)=>{
                        const c = dCol(h.prediction);
                        const w = Math.max(h.confidence?.oujdi??0,h.confidence?.darija??0);
                        return (
                          <div key={i} className="hist-item"
                            onClick={()=>{setText(h.text);setResult(null);taRef.current?.focus();}}
                            style={{padding:"9px 14px",borderRadius:10,
                              background:`${M[900]}44`,border:`1px solid ${M[700]}22`,
                              cursor:"pointer",display:"flex",alignItems:"center",gap:10,
                              transition:"all .15s"}}>
                            <div style={{width:7,height:7,borderRadius:"50%",background:c.dot,
                              flexShrink:0,boxShadow:`0 0 5px ${c.dot}`}}/>
                            <span style={{fontSize:13,color:`${M[200]}77`,flex:1,overflow:"hidden",
                              textOverflow:"ellipsis",whiteSpace:"nowrap",direction:"rtl"}}>
                              {h.text}
                            </span>
                            <span style={{fontSize:13,fontWeight:800,color:c.text,flexShrink:0,letterSpacing:-.3}}>
                              {w.toFixed(0)}%
                            </span>
                            <span style={{fontSize:10,color:c.text,opacity:.7,flexShrink:0}}>
                              {h.prediction}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab==="lexique" && (
            <div style={{maxWidth:900,margin:"0 auto"}}>
              <div style={{marginBottom:28}}>
                <h2 style={{fontSize:"clamp(1.5rem,2.8vw,2.1rem)",fontWeight:900,letterSpacing:-1,
                  margin:"0 0 8px",
                  background:`linear-gradient(135deg,#fff,${M[200]})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  Lexique Comparatif
                </h2>
                <p style={{fontSize:14,color:`${M[200]}55`,fontWeight:300,marginBottom:18}}>
                  {COMPARISON.length} entrées · mots qui différencient les deux variantes dialectales
                </p>

                <div style={{display:"flex",alignItems:"center",gap:10,
                  background:`${M[800]}55`,border:`1px solid ${M[600]}44`,
                  borderRadius:11,padding:"10px 16px",maxWidth:360}}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={`${M[300]}88`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
                  </svg>
                  <input
                    value={lexSearch}
                    onChange={e=>setLexSearch(e.target.value)}
                    placeholder="Rechercher un mot…"
                    style={{background:"transparent",border:"none",outline:"none",
                      color:"#fff",fontSize:14,flex:1}}
                  />
                  {lexSearch && (
                    <button onClick={()=>setLexSearch("")}
                      style={{background:"transparent",border:"none",color:`${M[300]}55`,
                        cursor:"pointer",fontSize:13,padding:0}}>✕</button>
                  )}
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",
                background:`${M[900]}99`,border:`1px solid ${M[700]}44`,
                borderRadius:"14px 14px 0 0",padding:"13px 22px",
                borderBottom:`1px solid ${M[700]}44`}}>
                <span style={{fontSize:11,fontWeight:700,color:`${M[300]}77`,
                  textTransform:"uppercase",letterSpacing:.9}}>Concept</span>
                <span style={{fontSize:11,fontWeight:700,color:"#a78bfa",
                  textTransform:"uppercase",letterSpacing:.9,textAlign:"center"}}>
                  الوجدية / Oujdi
                </span>
                <span style={{fontSize:11,fontWeight:700,color:"#10b981",
                  textTransform:"uppercase",letterSpacing:.9,textAlign:"center"}}>
                  الدارجة / Darija
                </span>
              </div>

              <div style={{background:`${M[900]}55`,border:`1px solid ${M[700]}44`,
                borderTop:"none",borderRadius:"0 0 14px 14px",overflow:"hidden"}}>
                {filteredLex.length === 0 ? (
                  <div style={{padding:"32px",textAlign:"center",color:`${M[300]}44`,fontSize:14}}>
                    Aucun résultat pour « {lexSearch} »
                  </div>
                ) : filteredLex.map((row,i)=>(
                  <div key={i} className="lex-row" style={{display:"grid",gridTemplateColumns:"1.4fr 1fr 1fr",
                    borderBottom:i<filteredLex.length-1?`1px solid ${M[800]}55`:"none"}}>
                    <div className="lex-cell" style={{padding:"13px 22px",fontSize:13,
                      color:`${M[200]}77`,background:i%2===0?`${M[900]}33`:"transparent",
                      transition:"background .15s",alignSelf:"center"}}>
                      {row.concept}
                    </div>

                    <div className="lex-cell" style={{padding:"13px 16px",textAlign:"center",
                      background:i%2===0?`${M[900]}33`:"transparent",transition:"background .15s",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{display:"inline-block",padding:"6px 18px",borderRadius:20,
                        background:"#7c3aed22",border:"1px solid #7c3aed44",
                        color:"#c4b5fd",fontSize:16,fontWeight:700,direction:"rtl",
                        cursor:"pointer",transition:"all .15s"}}
                        onClick={()=>{setText(row.oujdi);setTab("classifier");setTimeout(()=>taRef.current?.focus(),100);}}>
                        {row.oujdi}
                      </span>
                    </div>

                    <div className="lex-cell" style={{padding:"13px 16px",textAlign:"center",
                      background:i%2===0?`${M[900]}33`:"transparent",transition:"background .15s",
                      display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <span style={{display:"inline-block",padding:"6px 18px",borderRadius:20,
                        background:"#05966922",border:"1px solid #05966944",
                        color:"#6ee7b7",fontSize:16,fontWeight:700,direction:"rtl",
                        cursor:"pointer",transition:"all .15s"}}
                        onClick={()=>{setText(row.darija);setTab("classifier");setTimeout(()=>taRef.current?.focus(),100);}}>
                        {row.darija}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p style={{fontSize:12,color:`${M[300]}44`,textAlign:"center",marginTop:14}}>
                Cliquez sur un mot pour le tester directement dans le Classifier
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}