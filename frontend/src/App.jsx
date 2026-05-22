import { useState, useEffect } from "react";
import ClassifierPage from "./ClassifierPage";

const M = {
  50:"#EEEDFE",100:"#CECBF6",200:"#AFA9EC",300:"#9590E4",
  400:"#7F77DD",500:"#6A62D0",600:"#534AB7",700:"#453D9E",
  800:"#3C3489",900:"#26215C",950:"#0e0c24",
};

function SidebarIcon({ svg, active, tooltip, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div style={{position:"relative"}}
      onMouseEnter={()=>setHover(true)}
      onMouseLeave={()=>setHover(false)}
      onClick={onClick}>
      <div style={{
        width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",
        borderRadius:10,cursor:"pointer",transition:"all .18s",
        background:active?`${M[500]}33`:hover?`${M[700]}22`:"transparent",
        borderLeft:active?`2px solid ${M[400]}`:"2px solid transparent",
        color:active?M[300]:hover?M[200]:`${M[300]}55`,
      }}>
        {svg}
      </div>
      {hover && (
        <div style={{
          position:"absolute",left:52,top:"50%",transform:"translateY(-50%)",
          background:"#1e1b3a",border:`1px solid ${M[700]}66`,
          color:M[100],fontSize:12,padding:"5px 10px",
          borderRadius:7,whiteSpace:"nowrap",zIndex:999,
          boxShadow:"0 4px 16px #00000066",pointerEvents:"none",
        }}>{tooltip}</div>
      )}
    </div>
  );
}

function Particles() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.3}}>
      {Array.from({length:24},(_,i)=>(
        <circle key={i}
          cx={`${(13+i*31)%100}%`} cy={`${(7+i*47)%100}%`}
          r={0.8+(i%5)*0.5} fill={M[300]}
          style={{animation:`twinkle ${2.5+(i%3)}s ease-in-out ${(i*.37)%4}s infinite alternate`}}
        />
      ))}
    </svg>
  );
}

function GridLines() {
  return (
    <svg style={{position:"fixed",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.06}}>
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={M[400]} strokeWidth="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  );
}

const ICONS = [
  {
    tooltip:"Classifier",
    svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
  },
  {
    tooltip:"Lexique",
    svg:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  },
];

const FEATURES = [
  {
    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>,
    title:"Détection Automatique", accent:M[500],
    desc:"Analysez n'importe quel texte en arabe dialectal. Le modèle identifie instantanément la variante Oujdi ou Darija.",
  },
  {
    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title:"Confiance en %", accent:M[400],
    desc:"Obtenez le pourcentage de confiance pour chaque dialecte avec visualisation graphique claire.",
  },
  {
    icon:<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    title:"Lexique Comparatif", accent:M[300],
    desc:"Explorez les mots qui distinguent le dialecte Oujdi de la Darija marocaine.",
  },
];

const STATS = [
  {n:"97.22%", l:"Précision"},
  {n:"100K", l:"Échantillons"},
  {n:"50K", l:"Oujdi"},
  {n:"50K", l:"Moroccan"},
  {n:"2", l:"Dialectes"},
];

export default function WelcomePage() {
  const [page, setPage] = useState("home");
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(()=>{ setTimeout(()=>setVisible(true), 80); },[]);

  const f = (delay=0) => ({
    opacity: visible?1:0,
    transform: visible?"translateY(0)":"translateY(30px)",
    transition:`opacity .75s cubic-bezier(.22,1,.36,1) ${delay}s, transform .75s cubic-bezier(.22,1,.36,1) ${delay}s`,
  });

  if (page==="classifier") return <ClassifierPage onBack={()=>setPage("home")}/>;

  return (
    <div style={{
      display:"flex",minHeight:"100vh",
      backgroundImage:"linear-gradient(rgba(14,12,36,.88), rgba(7,8,22,.94)), url('/bg.jpg')",
      backgroundSize:"cover",
      backgroundPosition:"center",
      backgroundAttachment:"fixed",
      fontFamily:"'Outfit','Segoe UI',system-ui,sans-serif",
      color:"#fff",overflow:"hidden",position:"relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,button{font-family:'Outfit',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${M[700]}88;border-radius:99px;}
        @keyframes twinkle{from{opacity:.15;}to{opacity:1;}}
        @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
        @keyframes pulse-ring{0%{box-shadow:0 0 0 0 ${M[500]}77;}70%{box-shadow:0 0 0 14px ${M[500]}00;}100%{box-shadow:0 0 0 0 ${M[500]}00;}}
        @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        button{cursor:pointer;}
      `}</style>

      <GridLines/>
      <Particles/>

      <div style={{
        width:56,flexShrink:0,zIndex:10,
        display:"flex",flexDirection:"column",alignItems:"center",
        padding:"14px 0",gap:4,
        background:"#0a0818",borderRight:`1px solid ${M[800]}44`,
      }}>
        <div onClick={()=>setPage("home")} style={{
          width:36,height:36,borderRadius:9,marginBottom:14,
          background:`linear-gradient(135deg,${M[500]},${M[400]})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          boxShadow:`0 4px 16px ${M[600]}66`,
          animation:"pulse-ring 2.6s ease-in-out infinite",cursor:"pointer",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
          </svg>
        </div>

        {ICONS.map((ic,i)=>(
          <SidebarIcon key={i} svg={ic.svg} tooltip={ic.tooltip}
            active={active===i}
            onClick={()=>{
              setActive(i);
              setPage("classifier");
            }}
          />
        ))}
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,overflowY:"auto"}}>
        <nav style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"16px 48px",
          borderBottom:`1px solid ${M[800]}44`,
          background:`${M[950]}cc`,backdropFilter:"blur(14px)",
          position:"sticky",top:0,zIndex:20,
        }}>
          <span onClick={()=>setPage("home")} style={{fontWeight:800,fontSize:19,letterSpacing:"-.5px",cursor:"pointer"}}>
            wajdi<span style={{color:M[400]}}>classify</span>
            <span style={{color:M[500],fontSize:12,fontWeight:400}}>.ai</span>
          </span>

          <div style={{display:"flex",gap:30}}>
            {["Classifier","Lexique"].map(item=>(
              <a key={item} href="#" onClick={e=>{e.preventDefault();setPage("classifier");}}
                style={{color:`${M[200]}77`,textDecoration:"none",fontSize:14,transition:"color .2s"}}
                onMouseOver={e=>e.target.style.color="#fff"}
                onMouseOut={e=>e.target.style.color=`${M[200]}77`}>
                {item}
              </a>
            ))}
          </div>

          <button onClick={()=>setPage("classifier")} style={{
            padding:"8px 18px",borderRadius:9,
            background:`linear-gradient(135deg,${M[600]},${M[500]})`,
            border:"none",color:"#fff",fontSize:13,fontWeight:600,
            boxShadow:`0 4px 14px ${M[600]}55`,transition:"all .2s",
          }}>
            Lancer le Classifier →
          </button>
        </nav>

        <section style={{
          flex:1,display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",
          padding:"70px 48px 50px",textAlign:"center",
        }}>
          <div style={{
            display:"inline-flex",alignItems:"center",gap:8,
            background:`${M[800]}66`,border:`1px solid ${M[600]}44`,
            borderRadius:20,padding:"5px 16px",marginBottom:22,
            fontSize:12,color:M[300],...f(0.1),
          }}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#4ade80",display:"inline-block"}}/>
            97.22% de précision · DistilBERT + LoRA
          </div>

          <h1 style={{
            fontSize:"clamp(2.8rem,6vw,5rem)",
            fontWeight:900,lineHeight:1.06,letterSpacing:"-2px",
            marginBottom:16,maxWidth:820,
            background:`linear-gradient(135deg,#fff 0%,${M[200]} 50%,${M[400]} 100%)`,
            backgroundSize:"200% auto",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
            animation:"shimmer 5s linear infinite",
            ...f(0.2),
          }}>
            Détectez le Dialecte<br/>
            <span style={{
              background:`linear-gradient(90deg,${M[400]},${M[300]},${M[500]})`,
              backgroundSize:"200% auto",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
              animation:"shimmer 3s linear infinite",
            }}>Oujdi ou Darija</span>
          </h1>

          <p style={{
            fontSize:18,color:`${M[200]}88`,lineHeight:1.7,
            maxWidth:540,margin:"0 auto 44px",fontWeight:300,...f(0.3),
          }}>
            Un modèle NLP basé sur <strong style={{color:"#c4b5fd"}}>DistilBERT multilingue</strong> et <strong style={{color:"#6ee7b7"}}>LoRA</strong> pour distinguer automatiquement le dialecte Oujdi de la Darija marocaine.
          </p>

          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:60,...f(0.4)}}>
            <button onClick={()=>setPage("classifier")} style={{
              padding:"16px 44px",borderRadius:13,
              background:`linear-gradient(135deg,${M[600]},${M[500]},${M[400]})`,
              backgroundSize:"200% auto",
              border:"none",color:"#fff",fontSize:16,fontWeight:700,
              boxShadow:`0 8px 32px ${M[600]}66`,
              animation:"shimmer 3s linear infinite",
            }}>
              Lancer le Classifier →
            </button>

            <button onClick={()=>setPage("classifier")} style={{
              padding:"16px 34px",borderRadius:13,
              background:"transparent",border:`1px solid ${M[600]}66`,
              color:M[200],fontSize:16,fontWeight:500,
            }}>
              Voir le Lexique
            </button>
          </div>

          <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",...f(0.5)}}>
            {[
              {label:"الوجدية / Oujdi", words:["دروك","عكود","واه","هاكاك","سقسي","ريض","مور"], color:"#a78bfa", border:"#7c3aed", bg:"#7c3aed15"},
              {label:"الدارجة / Darija", words:["دابا","بزاف","واخا","مزيان","راه","باش","فين"], color:"#6ee7b7", border:"#10b981", bg:"#10b98115"},
            ].map((d,i)=>(
              <div key={i} onClick={()=>setPage("classifier")} style={{
                padding:"18px 24px",borderRadius:16,
                background:d.bg,border:`1px solid ${d.border}44`,
                backdropFilter:"blur(8px)",cursor:"pointer",
                minWidth:220,
                animation:`float ${5+i}s ease-in-out ${i*.5}s infinite`,
              }}>
                <div style={{fontSize:12,color:`${d.color}88`,textTransform:"uppercase",
                  letterSpacing:1,marginBottom:12,fontWeight:600}}>
                  {d.label}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {d.words.map((w,j)=>(
                    <span key={j} style={{
                      padding:"4px 12px",borderRadius:20,fontSize:14,fontWeight:600,
                      background:`${d.border}22`,border:`1px solid ${d.border}44`,
                      color:d.color,direction:"rtl",
                    }}>{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{
          display:"flex",justifyContent:"center",gap:56,flexWrap:"wrap",
          padding:"22px 48px",
          borderTop:`1px solid ${M[800]}44`,borderBottom:`1px solid ${M[800]}44`,
          background:`${M[900]}44`,backdropFilter:"blur(8px)",
        }}>
          {STATS.map(({n,l})=>(
            <div key={n} style={{textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:800,
                background:`linear-gradient(135deg,#fff,${M[300]})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{n}</div>
              <div style={{fontSize:12,color:`${M[300]}66`,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        <section style={{padding:"72px 48px",maxWidth:1100,margin:"0 auto",width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:48}}>
            <h2 style={{fontSize:"2rem",fontWeight:800,letterSpacing:"-.6px",marginBottom:10}}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{color:`${M[200]}66`,fontSize:15,fontWeight:300}}>
              Une interface simple pour analyser et comprendre les dialectes marocains
            </p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:16}}>
            {FEATURES.map((c,i)=>(
              <div key={i} style={{
                padding:"26px 22px",borderRadius:14,
                background:`${M[900]}77`,border:`1px solid ${M[800]}55`,
                backdropFilter:"blur(8px)",
                position:"relative",overflow:"hidden",
              }}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:2,
                  background:`linear-gradient(90deg,transparent,${c.accent}88,transparent)`}}/>
                <div style={{
                  width:48,height:48,borderRadius:12,marginBottom:18,
                  background:`${c.accent}18`,border:`1px solid ${c.accent}33`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  color:c.accent,
                }}>{c.icon}</div>
                <h3 style={{fontSize:15,fontWeight:700,marginBottom:7,color:"#fff"}}>{c.title}</h3>
                <p style={{fontSize:13,color:`${M[200]}77`,lineHeight:1.65}}>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer style={{
          borderTop:`1px solid ${M[800]}44`,padding:"18px 48px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          color:`${M[300]}44`,fontSize:12,background:`${M[950]}cc`,
        }}>
          <span>© 2026 wajdiclassify.ai</span>
          <div style={{display:"flex",gap:20}}>
            {["Classifier","Lexique","Contact"].map(l=>(
              <a key={l} href="#" style={{color:`${M[300]}44`,textDecoration:"none"}}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}