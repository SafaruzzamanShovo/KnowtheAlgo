import React, { useState, useEffect } from 'react';
import { Save, Layout, User, MessageSquare, Briefcase, PenTool, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { HomeSettings, AboutSettings, CommunityPageSettings, ContributePageSettings } from '../../types';

interface SiteEditorProps {
  initialHome: HomeSettings;
  initialAbout: AboutSettings;
  initialCommunity: CommunityPageSettings;
  initialContribute: ContributePageSettings;
  onRefresh: () => void;
}

type Section = 'home' | 'about' | 'community' | 'contribute';

export const SiteEditor: React.FC<SiteEditorProps> = ({ 
  initialHome, initialAbout, initialCommunity, initialContribute, onRefresh 
}) => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [homeData, setHomeData] = useState(initialHome);
  const [aboutData, setAboutData] = useState(initialAbout);
  const [communityData, setCommunityData] = useState(initialCommunity);
  const [contributeData, setContributeData] = useState(initialContribute);
  const [saving, setSaving] = useState(false);

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
      if (activeSection === 'home') {
        await supabase.from('site_settings').upsert({ key: 'home_hero', value: homeData });
      } else if (activeSection === 'about') {
        await supabase.from('site_settings').upsert({ key: 'about_profile', value: aboutData });
      } else if (activeSection === 'community') {
        await supabase.from('site_settings').upsert({ key: 'community_page', value: communityData });
      } else if (activeSection === 'contribute') {
        await supabase.from('site_settings').upsert({ key: 'contribute_page', value: contributeData });
      }
      onRefresh();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: Section, label: string, icon: any }) => (
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
        <TabButton id="home" label="Home" icon={Layout} />
        <TabButton id="about" label="Profile" icon={User} />
        <TabButton id="community" label="Community" icon={Globe} />
        <TabButton id="contribute" label="Contribute" icon={PenTool} />
      </div>

      <div className="p-8">
        {activeSection === 'home' && (
          <div className="space-y-8">
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
                  <textarea
                    value={homeData.community_desc || ''}
                    onChange={e => setHomeData({...homeData, community_desc: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
                  <textarea
                    value={homeData.collab_desc || ''}
                    onChange={e => setHomeData({...homeData, collab_desc: e.target.value})}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

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
              <textarea
                value={aboutData.bio}
                onChange={e => setAboutData({...aboutData, bio: e.target.value})}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
          </div>
        )}

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
              <textarea
                value={communityData.subtitle}
                onChange={e => setCommunityData({...communityData, subtitle: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        )}

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
              <textarea
                value={contributeData.subtitle}
                onChange={e => setContributeData({...contributeData, subtitle: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
