import React, { useState, useEffect } from 'react';
import { Save, Layout, User, MessageSquare, Briefcase, PenTool, Globe, Settings, Plus, Trash2, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { 
  HomeSettings, AboutSettings, CommunityPageSettings, ContributePageSettings,
  BrandingSettings, FooterSettings, ValuePropItem, QuickNavItem
} from '../../types';
import { DualModeEditor } from '../DualModeEditor';
import { DynamicIcon } from '../DynamicIcon';

interface SiteEditorProps {
  initialHome: HomeSettings;
  initialAbout: AboutSettings;
  initialCommunity: CommunityPageSettings;
  initialContribute: ContributePageSettings;
  onRefresh: () => void;
}

export const SiteEditor = ({ 
  initialHome, initialAbout, initialCommunity, initialContribute, onRefresh 
}: any) => {
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'community' | 'contribute' | 'global'>('global');
  
  // State for all settings
  const [homeData, setHomeData] = useState<HomeSettings>(initialHome);
  const [aboutData, setAboutData] = useState<AboutSettings>(initialAbout);
  const [communityData, setCommunityData] = useState<CommunityPageSettings>(initialCommunity);
  const [contributeData, setContributeData] = useState<ContributePageSettings>(initialContribute);
  
  // New States
  const [brandingData, setBrandingData] = useState<BrandingSettings>({ siteName: '', logoText: '' });
  const [footerData, setFooterData] = useState<FooterSettings>({ text: '', copyright: '' });
  const [valuePropsData, setValuePropsData] = useState<ValuePropItem[]>([]);
  const [quickNavData, setQuickNavData] = useState<QuickNavItem[]>([]);

  // Skill Input State
  const [newSkill, setNewSkill] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchExtras = async () => {
      if (!supabase) return;
      const { data } = await supabase.from('site_settings').select('*');
      if (data) {
        const brand = data.find(s => s.key === 'site_branding');
        if (brand) setBrandingData(brand.value);
        
        const foot = data.find(s => s.key === 'site_footer');
        if (foot) setFooterData(foot.value);

        const vProps = data.find(s => s.key === 'home_value_props');
        if (vProps) setValuePropsData(vProps.value);

        const qNav = data.find(s => s.key === 'home_quick_nav');
        if (qNav) setQuickNavData(qNav.value);
      }
    };
    fetchExtras();
  }, []);

  useEffect(() => {
    setHomeData(initialHome);
    setAboutData(initialAbout);
    setCommunityData(initialCommunity);
    setContributeData(initialContribute);
  }, [initialHome, initialAbout, initialCommunity, initialContribute]);

  const handleSave = async () => {
    if (!supabase) return;
    setSaving(true);
    try {
      const updates = [];

      if (activeSection === 'home') {
        updates.push(supabase.from('site_settings').upsert({ key: 'home_hero', value: homeData }));
        updates.push(supabase.from('site_settings').upsert({ key: 'home_value_props', value: valuePropsData }));
        updates.push(supabase.from('site_settings').upsert({ key: 'home_quick_nav', value: quickNavData }));
      } else if (activeSection === 'about') {
        updates.push(supabase.from('site_settings').upsert({ key: 'about_profile', value: aboutData }));
      } else if (activeSection === 'community') {
        updates.push(supabase.from('site_settings').upsert({ key: 'community_page', value: communityData }));
      } else if (activeSection === 'contribute') {
        updates.push(supabase.from('site_settings').upsert({ key: 'contribute_page', value: contributeData }));
      } else if (activeSection === 'global') {
        updates.push(supabase.from('site_settings').upsert({ key: 'site_branding', value: brandingData }));
        updates.push(supabase.from('site_settings').upsert({ key: 'site_footer', value: footerData }));
      }
      
      await Promise.all(updates);
      
      onRefresh();
      alert('Settings saved successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to save settings: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setAboutData({
        ...aboutData,
        skills: [...(aboutData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter(s => s !== skillToRemove)
    });
  };

  const TabButton = ({ id, label, icon: Icon }: { id: any, label: string, icon: any }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
        activeSection === id 
          ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 border-indigo-600' 
          : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent'
      }`}
    >
      <Icon size={18} /> <span className="hidden md:inline">{label}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        <TabButton id="global" label="Global" icon={Settings} />
        <TabButton id="home" label="Home" icon={Layout} />
        <TabButton id="about" label="Profile" icon={User} />
        <TabButton id="community" label="Community" icon={Globe} />
        <TabButton id="contribute" label="Contribute" icon={PenTool} />
      </div>

      <div className="p-8">
        {/* GLOBAL SETTINGS */}
        {activeSection === 'global' && (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Branding</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Name (First Part)</label>
                  <input
                    type="text"
                    value={brandingData.siteName}
                    onChange={e => setBrandingData({...brandingData, siteName: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="Knowthe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo Text (Colored Part)</label>
                  <input
                    type="text"
                    value={brandingData.logoText}
                    onChange={e => setBrandingData({...brandingData, logoText: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="Algo"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Footer</h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Text</label>
                  <input
                    type="text"
                    value={footerData.text}
                    onChange={e => setFooterData({...footerData, text: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="Made with Heart by..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={footerData.copyright}
                    onChange={e => setFooterData({...footerData, copyright: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                    placeholder="All rights reserved."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HOME SETTINGS */}
        {activeSection === 'home' && (
          <div className="space-y-10">
            {/* Hero */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Layout size={20} className="text-indigo-600" /> Hero Section
              </h3>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={homeData.title}
                    onChange={e => setHomeData({...homeData, title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subtitle</label>
                  <textarea
                    value={homeData.subtitle}
                    onChange={e => setHomeData({...homeData, subtitle: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={homeData.cta_text}
                    onChange={e => setHomeData({...homeData, cta_text: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* Value Props */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Value Propositions</h3>
                <button 
                  onClick={() => setValuePropsData([...valuePropsData, { icon: 'Star', title: 'New Feature', desc: 'Description' }])}
                  className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Item
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {valuePropsData.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Icon (Lucide Name)</label>
                        <div className="flex items-center gap-2">
                          <DynamicIcon name={item.icon} size={20} className="text-gray-400" />
                          <input 
                            value={item.icon}
                            onChange={e => {
                              const newItems = [...valuePropsData];
                              newItems[idx].icon = e.target.value;
                              setValuePropsData(newItems);
                            }}
                            className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Title</label>
                        <input 
                          value={item.title}
                          onChange={e => {
                            const newItems = [...valuePropsData];
                            newItems[idx].title = e.target.value;
                            setValuePropsData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Description</label>
                        <input 
                          value={item.desc}
                          onChange={e => {
                            const newItems = [...valuePropsData];
                            newItems[idx].desc = e.target.value;
                            setValuePropsData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setValuePropsData(valuePropsData.filter((_, i) => i !== idx))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Nav */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Nav Cards</h3>
                <button 
                  onClick={() => setQuickNavData([...quickNavData, { icon: 'Link', title: 'New Link', desc: 'Go somewhere', link: '/', color: 'bg-gray-500' }])}
                  className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Card
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {quickNavData.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Icon</label>
                        <input 
                          value={item.icon}
                          onChange={e => {
                            const newItems = [...quickNavData];
                            newItems[idx].icon = e.target.value;
                            setQuickNavData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Title</label>
                        <input 
                          value={item.title}
                          onChange={e => {
                            const newItems = [...quickNavData];
                            newItems[idx].title = e.target.value;
                            setQuickNavData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Desc</label>
                        <input 
                          value={item.desc}
                          onChange={e => {
                            const newItems = [...quickNavData];
                            newItems[idx].desc = e.target.value;
                            setQuickNavData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Link</label>
                        <input 
                          value={item.link}
                          onChange={e => {
                            const newItems = [...quickNavData];
                            newItems[idx].link = e.target.value;
                            setQuickNavData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Color (Tailwind)</label>
                        <input 
                          value={item.color}
                          onChange={e => {
                            const newItems = [...quickNavData];
                            newItems[idx].color = e.target.value;
                            setQuickNavData(newItems);
                          }}
                          className="w-full px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => setQuickNavData(quickNavData.filter((_, i) => i !== idx))}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Home Sections */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare size={20} className="text-indigo-600" /> Community Section
              </h3>
              <div className="grid gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={homeData.community_title || ''}
                    onChange={e => setHomeData({...homeData, community_title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <DualModeEditor
                    content={homeData.community_desc || ''}
                    onChange={val => setHomeData({...homeData, community_desc: typeof val === 'string' ? val : ''})}
                    minHeight="150px"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-8 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-600" /> Collaboration Section
              </h3>
              <div className="grid gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={homeData.collab_title || ''}
                    onChange={e => setHomeData({...homeData, collab_title: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <DualModeEditor
                    content={homeData.collab_desc || ''}
                    onChange={val => setHomeData({...homeData, collab_desc: typeof val === 'string' ? val : ''})}
                    minHeight="150px"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE SETTINGS */}
        {activeSection === 'about' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={aboutData.name}
                  onChange={e => setAboutData({...aboutData, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Title / Role</label>
                <input
                  type="text"
                  value={aboutData.role}
                  onChange={e => setAboutData({...aboutData, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
              <DualModeEditor
                content={aboutData.bio}
                onChange={val => setAboutData({...aboutData, bio: typeof val === 'string' ? val : ''})}
                minHeight="200px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image URL</label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={aboutData.image}
                  onChange={e => setAboutData({...aboutData, image: e.target.value})}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
                <img src={aboutData.image} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resume Link</label>
                <input
                  type="text"
                  value={aboutData.resume_link || ''}
                  onChange={e => setAboutData({...aboutData, resume_link: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="text"
                  value={aboutData.socials?.email || ''}
                  onChange={e => setAboutData({...aboutData, socials: {...aboutData.socials, email: e.target.value}})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {/* Skills Manager */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technical Arsenal (Skills)</h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill (e.g. React, Python, AWS)..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  />
                  <button 
                    onClick={addSkill}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aboutData.skills?.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium flex items-center gap-2 group">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-gray-400 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {(!aboutData.skills || aboutData.skills.length === 0) && (
                    <span className="text-gray-400 text-sm italic">No skills added yet.</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Note: Skills are automatically categorized on your profile page based on keywords (e.g., "React" goes to Frontend, "AWS" to Infrastructure).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* COMMUNITY SETTINGS */}
        {activeSection === 'community' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Community Page Header</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
              <input
                type="text"
                value={communityData.title}
                onChange={e => setCommunityData({...communityData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle / Description</label>
              <DualModeEditor
                content={communityData.subtitle}
                onChange={val => setCommunityData({...communityData, subtitle: typeof val === 'string' ? val : ''})}
                minHeight="150px"
              />
            </div>
          </div>
        )}

        {/* CONTRIBUTE SETTINGS */}
        {activeSection === 'contribute' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contribute Page Header</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Page Title</label>
              <input
                type="text"
                value={contributeData.title}
                onChange={e => setContributeData({...contributeData, title: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle / Description</label>
              <DualModeEditor
                content={contributeData.subtitle}
                onChange={val => setContributeData({...contributeData, subtitle: typeof val === 'string' ? val : ''})}
                minHeight="150px"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
