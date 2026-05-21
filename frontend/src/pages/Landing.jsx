import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Terminal, Code2, ShieldCheck, Layers, Globe2, Zap } from 'lucide-react';

const FadeUp = ({ children, delay = 0 }) => (
  <div>
    {children}
  </div>
);

export default function Landing() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#060202', 
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(248, 140, 125, 0.07) 0%, transparent 75%), radial-gradient(circle at 0% 0%, rgba(255,0,0,0.03) 0%, transparent 50%)',
      color: '#fff', 
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif', 
      overflowX: 'hidden', 
      position: 'relative' 
    }}>

      {/* Hyper-Premium Ambient Background Beam */}
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', height: '600px', background: 'radial-gradient(circle at 50% 20%, rgba(248, 140, 125, 0.12) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono&display=swap');
        
        .site-container { width: 92%; max-width: 1100px; margin: 0 auto; }

        .nav-logo { font-weight: 900; letter-spacing: 0.2em; font-size: 0.85rem; color: #fff; text-transform: uppercase; }
        
        .glass-pill {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 600;
          color: #f88c7d; display: inline-flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;
          letter-spacing: 0.02em; backdrop-filter: blur(10px);
        }

        .hero-h1 {
          font-size: clamp(3.2rem, 6vw, 4.8rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.04em; margin-bottom: 1.5rem;
        }
        .text-gradient { background: linear-gradient(to right, #fff, rgba(255,255,255,0.5)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        .primary-btn {
          background: #fff; color: #000; border-radius: 6px; padding: 0.8rem 1.8rem;
          font-weight: 700; font-size: 0.9rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.6rem;
          transition: all 0.2s ease; box-shadow: 0 0 0 0 rgba(255,255,255,0.3);
        }
        .primary-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,255,255,0.15); background: #f1f1f1; }

        .secondary-btn {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;
          padding: 0.8rem 1.8rem; color: #fff; font-weight: 600; font-size: 0.9rem; text-decoration: none;
          transition: all 0.2s ease;
        }
        .secondary-btn:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }

        .grid-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%);
          border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 2rem;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .grid-card:hover { border-color: rgba(248, 140, 125, 0.2); background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%); }

        .icon-box {
          width: 40px; height: 40px; border-radius: 8px; background: rgba(248,140,125,0.1);
          display: flex; align-items: center; justify-content: center; color: #f88c7d; margin-bottom: 1.2rem;
        }

        /* High-End IDE Mockup CSS */
        .ide-mock {
          background: #080809; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }
        .ide-head { background: #111; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0.6rem 1rem; display: flex; gap: 0.4rem; }
        .ide-dot { width: 10px; height: 10px; border-radius: 50%; }

        @media (max-width: 960px) {
          .hero-split { grid-template-columns: 1fr !important; text-align: center; gap: 3rem !important; padding-top: 100px !important; }
          .hero-cta { justify-content: center; }
        }
      `}} />

      {/* Clean Modular Navigation */}
      <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, height: '75px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.2)' }}>
        <div className="site-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="nav-logo">CloudForge</div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
             <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}>Docs</Link>
             <Link to="/login" className="secondary-btn" style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem' }}>Log In</Link>
          </div>
        </div>
      </nav>

      {/* Cinematic Hero Matrix */}
      <main className="site-container hero-split" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', minHeight: '90vh', alignItems: 'center', gap: '4rem', paddingTop: '75px' }}>
        
        <div>
          <FadeUp>
            <div className="glass-pill">
              <span style={{ width: '6px', height: '6px', background: '#f88c7d', borderRadius: '50%', boxShadow: '0 0 8px #f88c7d' }} />
              v2.4.0 Release Candidate Stable
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="hero-h1">
              Orchestrate <br />
              <span className="text-gradient">Total Complexity.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p style={{ fontSize: '1.15rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '520px', marginBottom: '2.5rem' }}>
              Eliminate fragmented deployment tooling. Instantly bind Git repositories to secure Kubernetes clusters with a singular, immutable infrastructure core.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="hero-cta" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" className="primary-btn">
                <Zap size={16} fill="currentColor" /> Get Started Free
              </Link>
              <Link to="/login" className="secondary-btn">View Architecture</Link>
            </div>
          </FadeUp>
        </div>

        {/* High-End Product Mock Asset Component instead of just an image float */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px', position: 'relative' }}>
             {/* Underlying structural glow for professional touch */}
             <div style={{ position: 'absolute', top: '20%', left: '20%', right: '20%', bottom: '20%', background: '#f88c7d', opacity: 0.2, filter: 'blur(60px)', zIndex: 0 }} />
             <img 
               src="/hero_asset_coral.png" 
               alt="Platform Rendering" 
               style={{ 
                 width: '100%', 
                 height: 'auto', 
                 position: 'relative', 
                 zIndex: 1, 
                 mixBlendMode: 'screen', 
                 maskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
                 WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)'
               }} 
             />
          </div>
        </div>
      </main>

      {/* Elite Tech Integrated Grid - Replaces standard cards */}
      <section style={{ padding: '60px 0', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="site-container">
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                { icon: Terminal, title: 'GitOps Integration', desc: 'Direct bind between your origin repository and your fleet configuration manifests.' },
                { icon: ShieldCheck, title: 'Zero-Trust Security', desc: 'Military-grade container hard-isolation automatically imposed upon creation.' },
                { icon: Code2, title: 'IaC Rendering', desc: 'We compile high-level intents into absolute Terraform-executable primitives.' }
              ].map((item, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="grid-card">
                    <div className="icon-box"><item.icon size={20} /></div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </FadeUp>
              ))}
           </div>
        </div>
      </section>

      {/* PROFESSIONAL CODE TERMINAL MOCKUP SECTION (Key for "Professional" vibe) */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(to bottom, transparent, #040405)' }}>
        <div className="site-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '4rem', alignItems: 'center' }}>
           <div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>Deterministic <br/> Deployments.</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                 Define your system requirements declaratively. Our platform handles resolution, synchronization, and node validation dynamically.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe2 size={16} color="#f88c7d" /> 24 Regional Hubs
                 </div>
                 <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.1)' }} />
                 <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={16} color="#f88c7d" /> K8s Native
                 </div>
              </div>
           </div>

           {/* THE PROFESSIONAL IDE MOCKUP COMPONENT */}
           <FadeUp delay={0.2}>
              <div className="ide-mock">
                 <div className="ide-head">
                    <div className="ide-dot" style={{ background: '#ff5f56' }} />
                    <div className="ide-dot" style={{ background: '#ffbd2e' }} />
                    <div className="ide-dot" style={{ background: '#27c93f' }} />
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', marginLeft: 'auto' }}>main.tf</div>
                 </div>
                 <div style={{ padding: '1.5rem', fontSize: '0.8rem', lineHeight: 1.7 }}>
                    <div style={{ color: '#c678dd' }}>resource <span style={{color:'#98c379'}}>"aws_eks_cluster"</span> <span style={{color:'#e06c75'}}>"forge"</span> {"{"}</div>
                    <div style={{ paddingLeft: '1.5rem' }}><span style={{color:'#e06c75'}}>name</span> = <span style={{color:'#98c379'}}>"prod-grid"</span></div>
                    <div style={{ paddingLeft: '1.5rem' }}><span style={{color:'#e06c75'}}>version</span> = <span style={{color:'#d19a66'}}>"1.29"</span></div>
                    <div style={{ paddingLeft: '1.5rem' }}><span style={{color:'#e06c75'}}>role_arn</span> = <span style={{color:'#56b6c2'}}>aws_iam_role.arn</span></div>
                    <div>{"}"}</div>
                    <br />
                    <div style={{ color: 'rgba(255,255,255,0.3)' }}># Executing plan...</div>
                    <div style={{ color: '#98c379' }}>Plan: 3 to add, 0 to change, 0 to destroy.</div>
                    <div style={{ color: '#56b6c2' }}>✓ Synchronized successfully [42ms]</div>
                 </div>
              </div>
           </FadeUp>
        </div>
      </section>

      {/* Final Conversion Substrate */}
      <section style={{ padding: '100px 0 120px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', height: '200px', background: 'radial-gradient(circle at 50% 100%, rgba(248, 140, 125, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="site-container">
          <FadeUp>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: '1rem' }}>Join High-Velocity Engineers.</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '480px', margin: '0 auto 2.5rem', fontSize: '1.05rem' }}>Scale without the cognitive overhead of cluster provisioning. Deploy in seconds.</p>
            <Link to="/register" className="primary-btn" style={{ padding: '0.9rem 2.5rem', fontSize: '0.95rem' }}>Initialize Workspace</Link>
          </FadeUp>
        </div>
      </section>

      {/* Proper High-End Professional Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.04)', background: '#040101', padding: '5rem 0 3rem' }}>
        <div className="site-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div className="nav-logo" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>CloudForge</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '260px' }}>
                The definitive orchestration backbone for high-velocity infrastructure delivery systems. Built for security first.
              </p>
            </div>
            <div>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', marginBottom: '1.2rem' }}>Platform</h4>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {['Features', 'Kubernetes Native', 'GitOps Sync', 'IAM Controls'].map(link => (
                   <li key={link}><a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.45)'}>{link}</a></li>
                 ))}
               </ul>
            </div>
            <div>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', marginBottom: '1.2rem' }}>Developers</h4>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {['Documentation', 'API Reference', 'System Status', 'Changelog'].map(link => (
                   <li key={link}><a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.45)'}>{link}</a></li>
                 ))}
               </ul>
            </div>
            <div>
               <h4 style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', marginBottom: '1.2rem' }}>Enterprise</h4>
               <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                 {['Security & SOC2', 'Private Cloud', 'Contact Sales', 'Legal'].map(link => (
                   <li key={link}><a href="#" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', transition: 'color 0.2s' }} onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.45)'}>{link}</a></li>
                 ))}
               </ul>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
             <div>&copy; {new Date().getFullYear()} CloudForge Systems, Inc. All rights reserved.</div>
             <div style={{ display: 'flex', gap: '1.5rem' }}>
               <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
               <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
               <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>SLA</a>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
