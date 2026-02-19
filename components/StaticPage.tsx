import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, User, Shield, Copyright, ExternalLink, Lock, Database, Eye } from 'lucide-react';

export type PageType = 'about' | 'privacy' | 'terms' | 'copyright';

interface StaticPageProps {
  type: PageType;
  onBack: () => void;
}

const StaticPage: React.FC<StaticPageProps> = ({ type, onBack }) => {
  const renderContent = () => {
    switch (type) {
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
            <div className="flex justify-center mb-6 text-ember-600 dark:text-ember-400">
               <Shield size={48} />
            </div>
            <h2 className="text-4xl font-serif font-bold text-center mb-2 text-slate-900 dark:text-white">Privacy Policy</h2>
            <p className="text-center text-slate-500 mb-10 text-sm">Last Updated: February 19, 2026</p>
            
            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p>
                At Eldrex Writings, accessible from <strong>eldrex.landecs.org</strong>, one of our main priorities is the privacy of our visitors. 
                This Privacy Policy document details the types of information that is collected and recorded by Eldrex Writings and how we use it. 
                By using our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 my-8 not-prose">
                 <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-3 text-lg">
                    <Database size={20} className="text-ember-600" /> Information We Collect
                 </h3>
                 <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                    We believe in minimalism regarding data. We do not require you to create an account or provide personal identification 
                    (such as your name or email address) to read our content.
                 </p>
                 <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex gap-2">
                        <span className="text-ember-500 font-bold">•</span>
                        <span><strong>Usage Data:</strong> We collect anonymous metrics regarding how you interact with the site (pages visited, time spent, scrolling behavior).</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-ember-500 font-bold">•</span>
                        <span><strong>Device Information:</strong> We may collect non-identifiable data about your device type, browser version, and screen size to optimize readability.</span>
                    </li>
                 </ul>
              </div>

              <h3>1. Analytics & Performance</h3>
              <p>
                We utilize <strong>Vercel Analytics</strong> to understand website traffic and performance. This service collects anonymous data 
                aggregated from visitors. It does not track your browsing history across other websites, nor does it collect Personally Identifiable Information (PII). 
                You have the right to opt-out of this collection via the "Settings" menu in our footer.
              </p>

              <h3>2. Local Storage & Preferences</h3>
              <p>
                Instead of invasive cookies, we use your browser's <strong>Local Storage</strong> to improve your user experience. 
                This data stays on your device and includes:
              </p>
              <ul>
                <li><strong>Theme Preference:</strong> Saving your choice of Light, Dark, or System mode.</li>
                <li><strong>Texture Preference:</strong> Saving your choice of Clean or Paper texture.</li>
                <li><strong>Font Settings:</strong> Remembering your preferred font size and style.</li>
                <li><strong>Read Count:</strong> Tracking how many articles you've read to display relevant support banners.</li>
                <li><strong>Consent Status:</strong> Remembering if you accepted or declined analytics.</li>
              </ul>

              <h3>3. Third-Party Links</h3>
              <p>
                Our website contains links to other websites (e.g., Ko-fi, GitHub, Facebook, Instagram). If you click on a third-party link, 
                you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to 
                review the Privacy Policy of these websites. We have no control over and assume no responsibility for the content, privacy policies, 
                or practices of any third-party sites or services.
              </p>

              <h3>4. Children's Information</h3>
              <p>
                We do not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child 
                provided this kind of information on our website, we strongly encourage you to contact us immediately, and we will do our best 
                efforts to promptly remove such information from our records.
              </p>

              <hr />
              
              <p className="text-sm italic opacity-80">
                If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
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
            <h2 className="text-4xl font-serif font-bold text-center mb-2 text-slate-900 dark:text-white">Terms of Use</h2>
            <p className="text-center text-slate-500 mb-10 text-sm">Effective Date: February 19, 2026</p>

            <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
              <p>
                Welcome to <strong>Eldrex Writings</strong>. By accessing this website, you agree to comply with and be bound by the following 
                terms and conditions of use, which together with our Privacy Policy govern our relationship with you in relation to this website.
              </p>

              <h3>1. Intellectual Property Rights</h3>
              <p>
                Unless otherwise stated, <strong>Eldrex Delos Reyes Bula</strong> owns the intellectual property rights for the written content 
                (articles, stories, code snippets, and reflections) on Eldrex Writings. All intellectual property rights are reserved.
              </p>
              <p><strong>You may:</strong></p>
              <ul>
                <li>Read, view, and print pages for your own personal use.</li>
                <li>Share links to our content on social media or other platforms.</li>
                <li>Quote short excerpts (up to 100 words) with a clear credit and hyperlink back to the original article.</li>
              </ul>
              <p><strong>You must not:</strong></p>
              <ul>
                <li>Republish material from Eldrex Writings without explicit written consent.</li>
                <li>Sell, rent, or sub-license material from Eldrex Writings.</li>
                <li>Reproduce, duplicate, or copy full articles for commercial purposes.</li>
              </ul>

              <h3>2. User Conduct</h3>
              <p>
                By using this website, you agree not to use it in any way that causes, or may cause, damage to the website or impairment of the 
                availability or accessibility of Eldrex Writings. You must not use this website to copy, store, host, transmit, send, use, publish, 
                or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, 
                rootkit, or other malicious computer software.
              </p>

              <h3>3. Disclaimer</h3>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-lg border-l-4 border-amber-500 not-prose my-6">
                <p className="text-slate-700 dark:text-slate-200 text-sm m-0">
                  The information provided on this blog is for general informational and educational purposes only. It reflects the personal 
                  experiences and opinions of the author. It does not constitute professional advice (medical, legal, financial, or psychological). 
                  Any action you take upon the information you find on this website is strictly at your own risk.
                </p>
              </div>

              <h3>4. External Links</h3>
              <p>
                From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality 
                links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites 
                do not imply a recommendation for all the content found on these sites.
              </p>

              <h3>5. Changes to These Terms</h3>
              <p>
                We reserve the right to revise these terms and conditions at any time. By using this website, you are expected to review these terms 
                on a regular basis.
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
                  <Shield size={18} className="text-ember-600" />
                  Asset Credits Notice
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  The images featured in the articles below are respectfully acknowledged as the property of their respective owners:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> What if AI Can Feel?</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> When Perfection Replaces Emotions</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> If You Have Time to Sit</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> When Responsibility Becomes a Teacher</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Future You in an AI Era</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> The Distance of the Sun</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Climbing Beyond the Impossible</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Strength in Silence</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Belief We Believe</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Worth a Thousand</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> Judgement Where I Began to Change</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> When Doubt Walks Beside Me</li>
                  <li className="flex items-start gap-2"><span className="text-ember-500">•</span> The Space I Need</li>
                </ul>
              </div>

              <h3>Removal Request</h3>
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <p className="text-base text-slate-600 dark:text-slate-300 mb-2">
                    I deeply respect creative rights. If you are the copyright owner of any image used here and would like it removed, credited differently, 
                    or have concerns about its usage, please contact me immediately. Requests will be honored promptly.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 text-sm mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <a href="https://eldrex.landecs.org/contact.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ember-600 hover:text-ember-700 font-medium break-all">
                        <ExternalLink size={14} /> eldrex.landecs.org/contact.me
                    </a>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <a href="mailto:eldrexdelosreyesbula@gmail.com" className="flex items-center gap-2 text-ember-600 hover:text-ember-700 font-medium break-all">
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
        className="group flex items-center gap-2 text-slate-500 hover:text-ember-600 transition-colors mb-8"
      >
        <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-ember-50 dark:group-hover:bg-ember-900/20 transition-colors">
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