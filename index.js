import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

const questions = [
  { id:1, category:"Energia Natural", type:"single", text:"Quando você resolve um problema difícil, o que sente?",
    options:[
      {text:"Energia — quero resolver mais, fico vivo/a nisso.", talents:["resolucao","lideranca"]},
      {text:"Satisfação profunda — gosto de encontrar o 'encaixe perfeito'.", talents:["analise","estrategia"]},
      {text:"Alívio, mas logo penso em como comunicar a solução.", talents:["comunicacao","influencia"]},
      {text:"Vontade de organizar tudo para que não aconteça de novo.", talents:["organizacao","sistematizacao"]},
    ]},
  { id:2, category:"Fluxo", type:"single", text:"Em que tipo de atividade você 'perde a noção do tempo'?",
    options:[
      {text:"Criando algo — um plano, design, texto, produto.", talents:["criatividade","visao"]},
      {text:"Conversando e conectando pessoas.", talents:["comunicacao","relacional"]},
      {text:"Organizando, estruturando, construindo sistemas.", talents:["organizacao","sistematizacao"]},
      {text:"Analisando dados, padrões, cenários.", talents:["analise","estrategia"]},
    ]},
  { id:3, category:"Como te enxergam", type:"single", text:"Qual frase as pessoas mais repetem sobre você?",
    options:[
      {text:'"Você sempre sabe o que fazer."', talents:["lideranca","resolucao"]},
      {text:'"Você explica tão bem, tudo fica claro."', talents:["comunicacao","ensino"]},
      {text:'"Você pensa em tudo antes de todo mundo."', talents:["estrategia","visao"]},
      {text:'"Com você, a coisa acontece de verdade."', talents:["execucao","resolucao"]},
    ]},
  { id:4, category:"Modo de Pensar", type:"single", text:"Quando recebe uma ideia nova, sua primeira reação é:",
    options:[
      {text:"Ver o potencial — imaginar onde aquilo pode chegar.", talents:["visao","criatividade"]},
      {text:"Questionar — preciso entender antes de aceitar.", talents:["analise","estrategia"]},
      {text:"Conectar — isso me lembra algo que pode funcionar junto.", talents:["relacional","estrategia"]},
      {text:"Agir — já estou pensando nos próximos passos.", talents:["execucao","resolucao"]},
    ]},
  { id:5, category:"Com Pessoas", type:"single", text:"Em um grupo, qual papel você naturalmente assume?",
    options:[
      {text:"Quem direciona e decide quando ninguém sabe o que fazer.", talents:["lideranca","resolucao"]},
      {text:"Quem escuta e entende o que cada um precisa.", talents:["relacional","ensino"]},
      {text:"Quem tem a ideia que transforma a conversa.", talents:["criatividade","visao"]},
      {text:"Quem organiza e garante que as coisas saiam do papel.", talents:["organizacao","execucao"]},
    ]},
  { id:6, category:"Aprendizado", type:"open", text:"Descreva algo que você aprendeu rápido e sem esforço — algo que para outros parecia difícil.", placeholder:"Escreva livremente..."},
  { id:7, category:"Impacto", type:"single", text:"O que te dá mais satisfação profissional?",
    options:[
      {text:"Ver minha visão ganhar forma e se tornar realidade.", talents:["visao","execucao"]},
      {text:"Transformar alguém — ensinar, inspirar, fazer crescer.", talents:["ensino","influencia"]},
      {text:"Construir algo que dure — sistemas, processos, estruturas.", talents:["sistematizacao","organizacao"]},
      {text:"Conquistar algo que parecia impossível.", talents:["lideranca","resolucao"]},
    ]},
  { id:8, category:"Intensidade", type:"rating", text:"O quanto você é naturalmente orientado/a a resultados?", sub:"1 = Prefiro o processo  ·  5 = Vivo pelos resultados",
    talentsHigh:["execucao","resolucao"], talentsLow:["criatividade","relacional"]},
  { id:9, category:"Comunicação", type:"single", text:"Como você prefere transmitir algo importante?",
    options:[
      {text:"Contando uma história que faça a pessoa sentir.", talents:["comunicacao","influencia"]},
      {text:"Com dados, estrutura e clareza lógica.", talents:["analise","estrategia"]},
      {text:"Criando algo visual — um deck, diagrama, mapa.", talents:["criatividade","visao"]},
      {text:"Conversando olho no olho, lendo a reação.", talents:["relacional","influencia"]},
    ]},
  { id:10, category:"Resistência", type:"single", text:"O que você aguenta melhor do que a maioria das pessoas?",
    options:[
      {text:"Ambiguidade — fico bem sem ter todas as respostas.", talents:["visao","estrategia"]},
      {text:"Pressão — funciono melhor quando o jogo está valendo.", talents:["lideranca","execucao"]},
      {text:"Complexidade — quanto mais variáveis, mais me interessa.", talents:["analise","sistematizacao"]},
      {text:"Tensão interpessoal — não fujo de conversas difíceis.", talents:["lideranca","relacional"]},
    ]},
  { id:11, category:"Raiz", type:"open", text:"Para qual tipo de problema as pessoas te procuram — mesmo sem você ter pedido esse papel?", placeholder:"Seja específico/a — o que costumam te pedir?"},
  { id:12, category:"Modo de Criar", type:"single", text:"Quando precisa criar algo do zero, você começa por:",
    options:[
      {text:"Uma imagem do resultado final — trabalho de trás pra frente.", talents:["visao","estrategia"]},
      {text:"Uma análise do problema — entender antes de criar.", talents:["analise","sistematizacao"]},
      {text:"Uma conversa — ideias surgem em contato com outros.", talents:["relacional","comunicacao"]},
      {text:"Fazendo — começo algo e deixo evoluir.", talents:["execucao","criatividade"]},
    ]},
  { id:13, category:"Legado", type:"single", text:"Daqui a 10 anos, o que você quer que digam sobre seu trabalho?",
    options:[
      {text:'"Ele/ela construiu algo que transformou o setor."', talents:["visao","lideranca"]},
      {text:'"Ele/ela criou sistemas que ainda funcionam até hoje."', talents:["sistematizacao","execucao"]},
      {text:'"Ele/ela desenvolveu líderes e mudou vidas."', talents:["ensino","influencia"]},
      {text:'"Ele/ela resolveu problemas que ninguém conseguia."', talents:["resolucao","estrategia"]},
    ]},
  { id:14, category:"Força sob Pressão", type:"multi", max:3, text:"Em momentos de crise, quais forças aparecem naturalmente em você?", sub:"Selecione até 3",
    options:[
      {text:"Clareza — vejo o que importa enquanto outros entram em pânico.", talents:["estrategia","lideranca"]},
      {text:"Calma — mantenho o equilíbrio emocional do grupo.", talents:["relacional","lideranca"]},
      {text:"Velocidade — ajo enquanto outros ainda estão pensando.", talents:["execucao","resolucao"]},
      {text:"Criatividade — encontro saídas que ninguém havia considerado.", talents:["criatividade","resolucao"]},
      {text:"Estrutura — organizo o caos em passos claros.", talents:["organizacao","sistematizacao"]},
    ]},
  { id:15, category:"Essência", type:"open", text:'Complete: "Quando estou no meu melhor, eu sou alguém que..."', placeholder:"Deixe fluir — não existe resposta errada aqui."},
]

const talentProfiles = {
  visao:         {name:"Visão Estratégica",       emoji:"🔭"},
  lideranca:     {name:"Liderança Natural",        emoji:"🧭"},
  estrategia:    {name:"Pensamento Estratégico",   emoji:"♟️"},
  execucao:      {name:"Força de Execução",        emoji:"⚡"},
  comunicacao:   {name:"Comunicação Poderosa",     emoji:"🎙️"},
  relacional:    {name:"Inteligência Relacional",  emoji:"🤝"},
  analise:       {name:"Mente Analítica",          emoji:"🔍"},
  criatividade:  {name:"Criatividade Estruturada", emoji:"✨"},
  organizacao:   {name:"Organização e Clareza",    emoji:"🗂️"},
  sistematizacao:{name:"Sistematização",           emoji:"⚙️"},
  resolucao:     {name:"Resolução de Problemas",   emoji:"🎯"},
  ensino:        {name:"Talento para Ensinar",     emoji:"🌱"},
  influencia:    {name:"Influência e Persuasão",   emoji:"💫"},
}

function computeTalents(answers) {
  const scores = {}
  questions.forEach(q => {
    const ans = answers[q.id]
    if (ans === undefined || ans === null || ans === '') return
    if (q.type === 'single' && q.options) q.options[ans]?.talents.forEach(t => { scores[t] = (scores[t]||0)+2 })
    if (q.type === 'multi' && Array.isArray(ans)) ans.forEach(i => q.options[i]?.talents.forEach(t => { scores[t] = (scores[t]||0)+2 }))
    if (q.type === 'rating') {
      if (ans >= 4) q.talentsHigh?.forEach(t => { scores[t] = (scores[t]||0)+2 })
      else if (ans <= 2) q.talentsLow?.forEach(t => { scores[t] = (scores[t]||0)+2 })
    }
  })
  return Object.entries(scores).filter(([k]) => talentProfiles[k]).sort((a,b)=>b[1]-a[1]).slice(0,3)
}

const LETTERS = ['A','B','C','D','E']

export default function Quiz() {
  const [phase, setPhase] = useState('name')
  const [name, setName] = useState('')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [topTalents, setTopTalents] = useState([])

  const q = questions[current]
  const total = questions.length
  const pct = Math.round((current / total) * 100)
  const ans = answers[q?.id]

  function selectSingle(qid, idx) { setAnswers(p => ({...p, [qid]: idx})) }
  function selectMulti(qid, idx, max) {
    setAnswers(p => {
      const cur = p[qid] || []
      if (cur.includes(idx)) return {...p, [qid]: cur.filter(x => x !== idx)}
      if (cur.length >= max) return p
      return {...p, [qid]: [...cur, idx]}
    })
  }
  function saveOpen(qid, val) { setAnswers(p => ({...p, [qid]: val})) }
  function selectRating(qid, val) { setAnswers(p => ({...p, [qid]: val})) }

  async function finishQuiz() {
    setSaving(true)
    const talents = computeTalents(answers)
    setTopTalents(talents)
    try {
      const { error } = await supabase.from('results').insert({
        name: name.trim(),
        talents: talents.map(([k]) => k),
      })
      if (error) throw error
      setPhase('done')
    } catch(e) {
      setError('Erro ao salvar. Tente novamente.')
    }
    setSaving(false)
  }

  const ranks = ['1º Talento', '2º Talento', '3º Talento']

  if (phase === 'name') return (
    <div style={wrap}>
      <Head><title>Quiz de Talentos · Oparks Travel</title></Head>
      <div style={card}>
        <p style={labelStyle}>Oparks Travel · Descoberta de Talentos</p>
        <h1 style={h1}>Quais são os seus<br/><em style={{fontStyle:'italic',color:'#c9954a'}}>talentos naturais?</em></h1>
        <p style={subStyle}>15 perguntas para revelar o que você já carrega — e talvez ainda não tenha nomeado. Leva ~5 minutos.</p>
        <input
          style={inputStyle}
          placeholder="Seu nome completo..."
          value={name}
          onChange={e => { setName(e.target.value); setError('') }}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) setPhase('quiz') }}
        />
        {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'12px'}}>{error}</p>}
        <button style={btnPrimary} onClick={() => { if (name.trim()) setPhase('quiz'); else setError('Digite seu nome antes de continuar.') }}>
          Começar quiz →
        </button>
      </div>
    </div>
  )

  if (saving) return (
    <div style={wrap}>
      <div style={card}>
        <p style={{textAlign:'center',color:'#8a7d72',fontStyle:'italic'}}>Salvando seus resultados...</p>
      </div>
    </div>
  )

  if (phase === 'done') return (
    <div style={wrap}>
      <Head><title>Seus Talentos · Oparks Travel</title></Head>
      <div style={card}>
        <p style={labelStyle}>Seus resultados, {name.split(' ')[0]}</p>
        <h2 style={{...h1, marginBottom:'1.5rem'}}>Seus <em style={{fontStyle:'italic',color:'#c9954a'}}>3 talentos</em> dominantes:</h2>
        {topTalents.map(([key, score], i) => {
          const p = talentProfiles[key]
          const maxS = topTalents[0][1] || 1
          const pctBar = Math.round((score/maxS)*100)
          return (
            <div key={key} style={talentCardStyle}>
              <p style={{fontFamily:'monospace',fontSize:'11px',letterSpacing:'0.18em',color:'#c9954a',marginBottom:'4px'}}>{ranks[i]}</p>
              <p style={{fontSize:'18px',fontWeight:600,marginBottom:'6px'}}>{p.emoji} {p.name}</p>
              <div style={{height:'3px',background:'rgba(0,0,0,0.08)',borderRadius:'2px'}}>
                <div style={{height:'100%',width:pctBar+'%',background:'linear-gradient(90deg,#c9954a,#e8c98a)',borderRadius:'2px'}}></div>
              </div>
            </div>
          )
        })}
        <div style={{background:'#1a1410',color:'#f7f3ee',padding:'1.5rem',marginTop:'1.5rem',textAlign:'center',borderRadius:'8px'}}>
          <p style={{fontSize:'14px',fontStyle:'italic',color:'rgba(247,243,238,0.75)',lineHeight:1.6,margin:'0 0 12px'}}>Resultado salvo com sucesso! A Freedom já pode ver no painel do time.</p>
          <p style={{fontSize:'13px',color:'#c9954a',fontFamily:'monospace',margin:0}}>✓ OBRIGADO POR PARTICIPAR</p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={wrap}>
      <Head><title>Quiz de Talentos · Oparks Travel</title></Head>
      <div style={card}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'2rem'}}>
          <div style={{flex:1,height:'2px',background:'rgba(0,0,0,0.08)',borderRadius:'1px',position:'relative'}}>
            <div style={{position:'absolute',left:0,top:0,height:'100%',width:pct+'%',background:'#c9954a',borderRadius:'1px',transition:'width 0.4s ease'}}></div>
          </div>
          <span style={{fontFamily:'monospace',fontSize:'11px',color:'#8a7d72',whiteSpace:'nowrap'}}>{current+1} / {total}</span>
        </div>

        <p style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9954a',marginBottom:'8px'}}>{q.category}</p>
        <p style={{fontSize:'clamp(16px,3vw,22px)',lineHeight:1.35,marginBottom:'6px',fontWeight:400}}>{q.text}</p>
        {q.sub && <p style={{fontSize:'13px',color:'#8a7d72',fontStyle:'italic',marginBottom:'20px'}}>{q.sub}</p>}

        {q.type === 'single' && (
          <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'2rem'}}>
            {q.options.map((opt,i) => (
              <button key={i} onClick={() => selectSingle(q.id,i)}
                style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'12px 14px',border:ans===i?'1px solid #c9954a':'1px solid rgba(0,0,0,0.1)',background:ans===i?'rgba(201,149,74,0.06)':'transparent',cursor:'pointer',textAlign:'left',fontFamily:'Georgia,serif',color:'#1a1410',width:'100%',borderRadius:'6px',transition:'all 0.18s'}}>
                <span style={{fontFamily:'monospace',fontSize:'10px',color:'#c9954a',minWidth:'16px',paddingTop:'2px'}}>{LETTERS[i]}</span>
                <span style={{fontSize:'14px',lineHeight:1.5}}>{opt.text}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'multi' && (
          <>
            <p style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.15em',color:'#8a7d72',marginBottom:'10px'}}>Selecione até {q.max} opções</p>
            <div style={{display:'flex',flexDirection:'column',gap:'8px',marginBottom:'2rem'}}>
              {q.options.map((opt,i) => {
                const sel = Array.isArray(ans) && ans.includes(i)
                return (
                  <button key={i} onClick={() => selectMulti(q.id,i,q.max)}
                    style={{display:'flex',alignItems:'flex-start',gap:'10px',padding:'12px 14px',border:sel?'1px solid #c9954a':'1px solid rgba(0,0,0,0.1)',background:sel?'rgba(201,149,74,0.06)':'transparent',cursor:'pointer',textAlign:'left',fontFamily:'Georgia,serif',color:'#1a1410',width:'100%',borderRadius:'6px',transition:'all 0.18s'}}>
                    <span style={{fontFamily:'monospace',fontSize:'10px',color:'#c9954a',minWidth:'16px',paddingTop:'2px'}}>{LETTERS[i]}</span>
                    <span style={{fontSize:'14px',lineHeight:1.5}}>{opt.text}</span>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {q.type === 'open' && (
          <textarea
            style={{width:'100%',border:'none',borderBottom:'2px solid #c9954a',background:'transparent',padding:'8px 0',fontFamily:'Georgia,serif',fontSize:'15px',color:'#1a1410',outline:'none',resize:'none',minHeight:'80px',lineHeight:1.6,marginBottom:'2rem',boxSizing:'border-box'}}
            placeholder={q.placeholder}
            value={ans||''}
            onChange={e => saveOpen(q.id, e.target.value)}
            rows={3}
          />
        )}

        {q.type === 'rating' && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'8px',marginBottom:'2rem'}}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => selectRating(q.id,n)}
                style={{aspectRatio:'1',border:ans===n?'none':'1px solid rgba(0,0,0,0.1)',background:ans===n?'#1a1410':'transparent',color:ans===n?'#f7f3ee':'#8a7d72',cursor:'pointer',fontFamily:'monospace',fontSize:'14px',borderRadius:'6px',transition:'all 0.18s'}}>
                {n}
              </button>
            ))}
          </div>
        )}

        {error && <p style={{color:'#ef4444',fontSize:'13px',marginBottom:'12px'}}>{error}</p>}

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button style={{...btnSecondary, opacity:current===0?0.3:1}} onClick={() => { if(current>0) setCurrent(c=>c-1) }} disabled={current===0}>← Anterior</button>
          {current < total-1
            ? <button style={btnPrimary} onClick={() => setCurrent(c=>c+1)}>Próxima →</button>
            : <button style={btnPrimary} onClick={finishQuiz}>Salvar resultado →</button>
          }
        </div>
      </div>
    </div>
  )
}

const wrap = {minHeight:'100vh',background:'#f7f3ee',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem 1rem',fontFamily:'Georgia,serif',color:'#1a1410'}
const card = {width:'100%',maxWidth:600,background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:'12px',padding:'2.5rem 2rem',boxShadow:'0 8px 32px rgba(0,0,0,0.06)'}
const labelStyle = {fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9954a',marginBottom:'12px'}
const h1 = {fontSize:'clamp(22px,5vw,36px)',fontWeight:300,lineHeight:1.1,marginBottom:'12px'}
const subStyle = {fontSize:'15px',color:'#8a7d72',lineHeight:1.7,marginBottom:'24px'}
const inputStyle = {width:'100%',border:'none',borderBottom:'2px solid #c9954a',background:'transparent',padding:'8px 0',fontFamily:'Georgia,serif',fontSize:'16px',color:'#1a1410',outline:'none',marginBottom:'20px',boxSizing:'border-box'}
const btnPrimary = {background:'#1a1410',color:'#f7f3ee',border:'none',padding:'12px 28px',fontSize:'15px',cursor:'pointer',fontFamily:'Georgia,serif',letterSpacing:'0.04em',borderRadius:'6px',transition:'opacity 0.2s'}
const btnSecondary = {background:'transparent',color:'#1a1410',border:'1px solid rgba(0,0,0,0.15)',padding:'12px 20px',fontSize:'14px',cursor:'pointer',fontFamily:'Georgia,serif',borderRadius:'6px'}
const talentCardStyle = {border:'1px solid rgba(0,0,0,0.08)',borderRadius:'8px',padding:'16px',marginBottom:'10px'}
