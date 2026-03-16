import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, User, Shield, Copyright, ExternalLink, Lock, Database, Eye, Coffee } from 'lucide-react';

export type PageType = 'about' | 'privacy' | 'terms' | 'copyright' | 'contact' | 'donate';

interface StaticPageProps {
  type: PageType;
  onBack: () => void;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const renderContent = () => {
    switch (type) {
      case 'donate':
        return (
          <>
            <div className="flex justify-center mb-6 text-brand-600 dark:text-brand-400">
               <Coffee size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-4 text-slate-900 dark:text-white">Support My Work</h2>
            <p className="text-center text-slate-500 mb-10 max-w-xl mx-auto">
              If you enjoy my writing and want to support the journey, you can buy me a coffee! 
              Your support helps keep this blog running and allows me to dedicate more time to storytelling.
            </p>
            
            <div className="w-full h-[650px] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner bg-white">
              <iframe 
                id='kofiframe' 
                src='https://ko-fi.com/landecsorg/?hidefeed=true&widget=true&embed=true&preview=true' 
                style={{ border: 'none', width: '100%', padding: '4px', background: '#f9f9f9' }} 
                height='650' 
                title='landecsorg'
              />
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-400">
                Secure payments processed via Ko-fi. Thank you for your kindness!
              </p>
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="flex justify-center mb-6 text-brand-600 dark:text-brand-400">
               <User size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-8 text-slate-900 dark:text-white">Contact Me</h2>
            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p>
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. 
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex flex-col sm:flex-row gap-4 text-sm mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <a href="https://connect.landecs.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium break-all">
                        <ExternalLink size={14} /> eldrex.landecs.org/contact.me
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href="mailto:eldrexdelosreyesbula@gmail.com" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium break-all">
                        <User size={14} /> eldrexdelosreyesbula@gmail.com
                    </a>
                 </div>
              </div>
            </div>
          </>
        );
      case 'about':
        return (
          <>
            <div className="flex justify-center mb-8">
               <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-700 shadow-xl">
                 <img src="https://eldrex.landecs.org/squad/eldrex.png" alt="Eldrex" className="w-full h-full object-cover" />
               </div>
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-8 text-slate-900 dark:text-white">About Eldrex</h2>
            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p>
                Hello! I am <strong>Eldrex Delos Reyes Bula</strong>, a storyteller, developer, and curious mind exploring the intersection of humanity and technology. 
                Eldrex Writings is my digital garden—a place where I cultivate thoughts, document my journey, and share reflections on personal growth, 
                challenges, and the evolving digital landscape.
              </p>
              <p>
                My writing is rooted in personal experience. From my early days as a working student to navigating the complexities of college and 
                modern technology, I believe that every struggle carries a lesson worth sharing.
              </p>
              <h3>Why I Write</h3>
              <p>
                I write to clarify my own thinking and to connect with others who might be walking a similar path. In a world of fleeting content, 
                I aim to create something slower, deeper, and more meaningful. Whether it's about the philosophy of AI or the simple grit required 
                to get through a difficult week, my goal is to provide perspective.
              </p>
              <h3>Connect</h3>
              <p>
                Thank you for reading. If my words resonate with you, feel free to reach out or support my work.
              </p>
            </div>
          </>
        );
      case 'privacy':
        return (
          <>
            <div className="flex justify-center mb-6 text-brand-600 dark:text-brand-400">
               <Shield size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-2 text-slate-900 dark:text-white">Privacy Policy</h2>
            <p className="text-center text-slate-500 mb-10 text-sm">Last Updated: March 16, 2026</p>
            
            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p className="lead">
                Your privacy is of paramount importance to us. This Privacy Policy outlines how Eldrex Writings ("we", "our", or "the Blog") 
                collects, uses, and protects your information when you visit our website at <strong>eldrex.landecs.org</strong>.
              </p>

              <h3>1. Data Collection and Usage</h3>
              <p>
                We adhere to a "privacy-by-design" philosophy. We do not require user registration, and we do not collect Personally Identifiable Information (PII) 
                such as your name, physical address, or phone number unless you explicitly provide it through direct contact.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 my-8 not-prose">
                 <h4 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3 text-lg">
                    <Database size={20} className="text-brand-600" /> Technical Data We Process
                 </h4>
                 <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-3">
                        <div className="mt-1 bg-brand-500 rounded-full h-1.5 w-1.5 flex-shrink-0" />
                        <span><strong>Anonymous Analytics:</strong> We process aggregated data regarding site traffic, popular content, and user engagement levels to improve our storytelling.</span>
                    </li>
                    <li className="flex gap-3">
                        <div className="mt-1 bg-brand-500 rounded-full h-1.5 w-1.5 flex-shrink-0" />
                        <span><strong>Interaction Metrics:</strong> We track non-identifiable interactions such as scroll depth, reading time, and feature usage (e.g., Read Aloud, Highlights).</span>
                    </li>
                    <li className="flex gap-3">
                        <div className="mt-1 bg-brand-500 rounded-full h-1.5 w-1.5 flex-shrink-0" />
                        <span><strong>Device Metadata:</strong> Information about your browser type, operating system, and screen resolution is used solely for responsive design optimization.</span>
                    </li>
                 </ul>
              </div>

              <h3>2. Third-Party Services</h3>
              <p>
                To provide a high-quality experience, we utilize select third-party services. Each service has its own privacy standards:
              </p>
              <ul>
                <li><strong>Vercel Analytics:</strong> Used for privacy-focused traffic monitoring. It does not use persistent cookies or track users across different sites.</li>
                <li><strong>Firebase (Google Cloud):</strong> Powers our interactive features like ratings and highlights. Data is stored anonymously and is not linked to your real-world identity.</li>
                <li><strong>Google AdSense:</strong> We may display advertisements. Google uses cookies to serve ads based on your interests. You can manage these via <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</li>
              </ul>

              <h3>3. Local Storage Technology</h3>
              <p>
                We use browser-based <strong>Local Storage</strong> instead of tracking cookies for site preferences. This data remains on your device and is not transmitted to our servers. It stores:
              </p>
              <ul>
                <li>Visual preferences (Theme, Texture, Font size).</li>
                <li>Reading progress and session-based interactions.</li>
                <li>Consent preferences for analytics and cookies.</li>
              </ul>

              <h3>4. Data Security</h3>
              <p>
                We implement industry-standard security measures, including SSL/TLS encryption, to protect data in transit. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h3>5. Your Rights</h3>
              <p>
                Depending on your location (e.g., GDPR in the EU, CCPA in California), you may have rights regarding your data. Since we do not store PII, most requests for "deletion" or "access" are inherently satisfied by our anonymous architecture. You can clear your site data at any time by clearing your browser's cache and local storage.
              </p>

              <hr />
              
              <p className="text-sm italic opacity-80">
                For inquiries regarding this policy, please contact us at <a href="mailto:eldrexdelosreyesbula@gmail.com">eldrexdelosreyesbula@gmail.com</a>.
              </p>
            </div>
          </>
        );
      case 'terms':
        return (
          <>
            <div className="flex justify-center mb-6 text-slate-400 dark:text-slate-500">
               <FileText size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-2 text-slate-900 dark:text-white">Terms of Service</h2>
            <p className="text-center text-slate-500 mb-10 text-sm">Effective Date: March 16, 2026</p>

            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p className="lead">
                By accessing Eldrex Writings, you agree to be bound by these Terms of Service, all applicable laws and regulations, 
                and agree that you are responsible for compliance with any applicable local laws.
              </p>

              <h3>1. Intellectual Property License</h3>
              <p>
                The content published on this Blog, including but not limited to text, original graphics, and code, is the exclusive property of 
                <strong>Eldrex Delos Reyes Bula</strong>. 
              </p>
              <p><strong>Permitted Use:</strong></p>
              <ul>
                <li>You are granted a limited, non-exclusive license to access and view the content for personal, non-commercial use.</li>
                <li>Sharing via social media with proper attribution is encouraged.</li>
              </ul>
              <p><strong>Prohibited Use:</strong></p>
              <ul>
                <li>Commercial exploitation, reproduction, or redistribution of full articles without express written permission.</li>
                <li>Use of automated systems (scrapers, bots) to extract data from the Blog.</li>
                <li>Modification or "mirroring" of the content on any other server.</li>
              </ul>

              <h3>2. Disclaimer of Warranties</h3>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border-l-4 border-amber-500 not-prose my-8">
                <p className="text-slate-800 dark:text-slate-200 text-sm font-medium m-0 leading-relaxed">
                  The materials on Eldrex Writings are provided on an 'as is' basis. We make no warranties, expressed or implied, 
                  and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions 
                  of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                </p>
              </div>

              <h3>3. Limitations of Liability</h3>
              <p>
                In no event shall Eldrex Delos Reyes Bula or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the 
                materials on the Blog, even if we have been notified orally or in writing of the possibility of such damage.
              </p>

              <h3>4. Accuracy of Materials</h3>
              <p>
                The materials appearing on Eldrex Writings could include technical, typographical, or photographic errors. 
                We do not warrant that any of the materials on its website are accurate, complete, or current. 
                We may make changes to the materials contained on its website at any time without notice.
              </p>

              <h3>5. Governing Law</h3>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the Philippines, 
                and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>

              <hr />
              
              <p className="text-sm italic opacity-80">
                We reserve the right to update these terms at any time. Continued use of the site constitutes acceptance of the revised terms.
              </p>
            </div>
          </>
        );
      case 'copyright':
        return (
          <>
            <div className="flex justify-center mb-6 text-slate-500 dark:text-slate-400">
               <Copyright size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-8 text-slate-900 dark:text-white">Copyright & Credits</h2>
            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p>
                At Eldrex Writings, authenticity is a core value. We strive to create original content that reflects personal journeys and thoughts. 
                However, visual storytelling often requires imagery that captures the essence of a complex emotion or abstract thought.
              </p>
              
              <h3>Written Content</h3>
              <p>
                All written articles, code demonstrations, and site design are the intellectual property of <strong>Eldrex Delos Reyes Bula</strong> 
                (© {new Date().getFullYear()}). Unauthorized commercial reproduction is prohibited.
              </p>

              <h3>Visual Assets & Third-Party Content</h3>
              <p>
                While the written content is original, some of the visual assets (cover images, illustrations) used in specific articles 
                are <strong>not owned by me</strong>. They are the intellectual property of their respective rightful owners, artists, and photographers.
              </p>
              <p>
                These images are used under the principles of <strong>Fair Use</strong> for illustrative, educational, and commentary purposes 
                to enhance the narrative experience. I lay no claim to the ownership of these specific visuals.
              </p>
              
              <div className="not-prose bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 my-8">
                <h3 className="font-serif font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-brand-600" />
                  Asset Credits Notice
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  The images featured in the articles below are respectfully acknowledged as the property of their respective owners:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <div className="flex items-start gap-2">What if AI Can Feel?</div>
                  <div className="flex items-start gap-2">When Perfection Replaces Emotions</div>
                  <div className="flex items-start gap-2">If You Have Time to Sit</div>
                  <div className="flex items-start gap-2">When Responsibility Becomes a Teacher</div>
                  <div className="flex items-start gap-2">Future You in an AI Era</div>
                  <div className="flex items-start gap-2">The Distance of the Sun</div>
                  <div className="flex items-start gap-2">Climbing Beyond the Impossible</div>
                  <div className="flex items-start gap-2">Strength in Silence</div>
                  <div className="flex items-start gap-2">Belief We Believe</div>
                  <div className="flex items-start gap-2">Worth a Thousand</div>
                  <div className="flex items-start gap-2">Judgement Where I Began to Change</div>
                  <div className="flex items-start gap-2">When Doubt Walks Beside Me</div>
                  <div className="flex items-start gap-2">The Space I Need</div>
                  <div className="flex items-start gap-2">The Teacher Who Taught Me to Rise</div>
                  <div className="flex items-start gap-2">When Yes Was the Wrong Answer</div>
                  <div className="flex items-start gap-2">A Man Who Can Do What He Wants, Does What He Wants</div>
                  <div className="flex items-start gap-2">Mathematics, Life, and the Balance Between Easy and Hard</div>
                  <div className="flex items-start gap-2">Why Not You: A Personal Reflection on Courage and Action</div>
                  <div className="flex items-start gap-2">See Me After You</div>
                  <div className="flex items-start gap-2">Enough But Still Not Enough</div>
                  <div className="flex items-start gap-2">Shhhh.</div>
                  <div className="flex items-start gap-2">Who Am I Afraid of Being Behind?</div>
                  <div className="flex items-start gap-2">A Stranger Who Chose to Lead</div>
                  <div className="flex items-start gap-2">When Winning Does Not Feel Like Winning</div>
                </div>
              </div>

              <h3>Removal Request</h3>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <p className="text-base text-slate-600 dark:text-slate-300 mb-2">
                    I deeply respect creative rights. If you are the copyright owner of any image used here and would like it removed, credited differently, 
                    or have concerns about its usage, please contact me immediately. Requests will be honored promptly.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 text-sm mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <a href="https://connect.landecs.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium break-all">
                        <ExternalLink size={14} /> eldrex.landecs.org/contact.me
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href="mailto:eldrexdelosreyesbula@gmail.com" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium break-all">
                        <User size={14} /> eldrexdelosreyesbula@gmail.com
                    </a>
                 </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen"
    >
      <button 
        onClick={onBack}
        className="group flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8"
      >
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 transition-colors">
            <ArrowLeft size={20} />
        </div>
        <span className="font-bold text-sm">Back to Stories</span>
      </button>
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-16 shadow-sm border border-slate-100 dark:border-slate-800">
        {renderContent()}
      </div>
    </motion.div>
  );
};

export default StaticPage;
