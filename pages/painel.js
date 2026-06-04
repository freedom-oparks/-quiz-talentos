import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Head from 'next/head'

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

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
}

export default function Painel() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('results').select('*').order('created_at', { ascending: false })
    setResults(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const freq = {}
  results.forEach(r => (r.talents||[]).forEach(t => { freq[t] = (freq[t]||0)+1 }))
  const freqSorted = Object.entries(freq).sort((a,b) => b[1]-a[1])
  const maxFreq = freqSorted[0]?.[1] || 1

  return (
    <div style={{minHeight:'100vh',background:'#f7f3ee',padding:'2rem 1rem',fontFamily:'Georgia,serif',color:'#1a1410'}}>
      <Head><title>Painel de Talentos · Oparks Travel</title></Head>
      <div style={{maxWidth:860,margin:'0 auto'}}>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <p style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.2em',textTransform:'uppercase',color:'#c9954a',margin:'0 0 4px'}}>Oparks Travel · Painel da Gestora</p>
            <h1 style={{fontSize:'clamp(20px,4vw,32px)',fontWeight:300,margin:0}}>Talentos do Time</h1>
          </div>
          <button onClick={load} style={{background:'transparent',border:'1px solid rgba(0,0,0,0.15)',padding:'8px 16px',fontFamily:'Georgia,serif',fontSize:'13px',cursor:'pointer',borderRadius:'6px'}}>
            ↻ Atualizar
          </button>
        </div>

        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px',marginBottom:'2rem'}}>
          {[
            {num: results.length, label: 'Respostas'},
            {num: freqSorted.length, label: 'Talentos únicos'},
            {num: freqSorted[0] ? talentProfiles[freqSorted[0][0]]?.name : '—', label: 'Mais frequente'},
          ].map((s,i) => (
            <div key={i} style={{background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:'10px',padding:'1rem',textAlign:'center',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <div style={{fontSize: i===2?'14px':'28px',fontWeight:300,color:'#c9954a',lineHeight:1.2}}>{s.num}</div>
              <div style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.1em',textTransform:'uppercase',color:'#8a7d72',marginTop:'4px'}}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <p style={{textAlign:'center',color:'#8a7d72',fontStyle:'italic',padding:'2rem'}}>Carregando...</p>
        ) : results.length === 0 ? (
          <div style={{textAlign:'center',padding:'3rem',color:'#8a7d72'}}>
            <p style={{fontSize:'32px',marginBottom:'8px'}}>📭</p>
            <p>Nenhum resultado ainda.</p>
            <p style={{fontSize:'13px',marginTop:'4px'}}>Compartilhe o link do quiz com o time.</p>
          </div>
        ) : (
          <>
            {/* Frequency */}
            <div style={{background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:'10px',padding:'1.5rem',marginBottom:'1.5rem',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
              <p style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.18em',textTransform:'uppercase',color:'#c9954a',marginBottom:'1rem',paddingBottom:'8px',borderBottom:'1px solid rgba(0,0,0,0.06)'}}>Distribuição de talentos</p>
              {freqSorted.map(([key, count]) => {
                const p = talentProfiles[key]
                if (!p) return null
                const pct = Math.round((count/maxFreq)*100)
                return (
                  <div key={key} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid rgba(0,0,0,0.04)'}}>
                    <span style={{fontSize:'18px',minWidth:'24px'}}>{p.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <span style={{fontSize:'13px'}}>{p.name}</span>
                        <span style={{fontFamily:'monospace',fontSize:'11px',color:'#8a7d72'}}>{count} {count===1?'pessoa':'pessoas'}</span>
                      </div>
                      <div style={{height:'3px',background:'rgba(0,0,0,0.06)',borderRadius:'2px'}}>
                        <div style={{height:'100%',width:pct+'%',background:'#c9954a',borderRadius:'2px'}}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Members */}
            <div>
              <p style={{fontFamily:'monospace',fontSize:'10px',letterSpacing:'0.18em',textTransform:'uppercase',color:'#c9954a',marginBottom:'1rem'}}>Resultados individuais ({results.length})</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'10px'}}>
                {results.map((r,i) => (
                  <div key={i} style={{background:'#fff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:'10px',padding:'1rem',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'10px'}}>
                      <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'rgba(201,149,74,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,fontSize:'13px',color:'#c9954a',flexShrink:0}}>
                        {r.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <p style={{fontSize:'14px',fontWeight:600,margin:0}}>{r.name}</p>
                        <p style={{fontFamily:'monospace',fontSize:'10px',color:'#8a7d72',margin:'2px 0 0'}}>{formatDate(r.created_at)}</p>
                      </div>
                    </div>
                    <div style={{display:'flex',flexWrap:'wrap',gap:'4px'}}>
                      {(r.talents||[]).map(t => {
                        const p = talentProfiles[t]
                        return p ? (
                          <span key={t} style={{background:'rgba(201,149,74,0.1)',color:'#7a5c2e',fontSize:'11px',padding:'3px 8px',borderRadius:'4px',fontFamily:'monospace'}}>
                            {p.emoji} {p.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
