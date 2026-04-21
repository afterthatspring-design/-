/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Scroll, BookOpen, PenTool, Image as ImageIcon, ArrowLeft, Book, Trophy, GraduationCap, Users, Waves, Printer, Search, FileText, Layout, Filter, Menu, X } from 'lucide-react';
import { GANGTIE_DATA } from './data/gangtie';
import { RESOURCES_DATA, UNIT_NAMES } from './data/resources';

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Abstract Waves / Inverted Book Lines from Reference */}
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="text-gold">
        {/* Top Wave */}
        <path d="M15 40 Q 30 40, 50 15 Q 70 40, 85 40" />
        {/* Middle Wave */}
        <path d="M15 48 Q 30 48, 50 25 Q 70 48, 85 48" />
        {/* Bottom Wave */}
        <path d="M15 56 Q 30 56, 50 35 Q 70 56, 85 56" />
      </g>
      
      {/* Center Dot */}
      <circle cx="50" cy="50" r="3" fill="currentColor" className="text-gold" />
      
      {/* Decorative Texture/Mist Effect Symbolism on the left */}
      <circle cx="20" cy="25" r="1" fill="currentColor" className="text-gold/30 animate-pulse" />
      <circle cx="15" cy="30" r="0.8" fill="currentColor" className="text-gold/20" />
      <circle cx="25" cy="35" r="1.2" fill="currentColor" className="text-gold/40" />
    </svg>
  </div>
);

type ViewState = 'main' | 'books' | 'book-detail' | 'resource-navigator';
type BookSubView = 'index' | 'choice' | 'fill-blank' | 'short-answer' | 'interpretation' | 'answer' | 'all';

export default function App() {
  const [view, setView] = useState<ViewState>('main');
  const [subView, setSubView] = useState<BookSubView>('index');
  const [selectedBook, setSelectedBook] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll to top on view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view, subView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const menuItems = [
    { name: '教学资源', action: () => setView('resource-navigator') },
    { name: '汉字听写', id: 'hanzi' },
    { name: '诗词大会', id: 'shici' },
    { name: '名著导读', action: () => setView('books') },
    { name: '读书会', id: 'reading' },
    { name: '课题研究', id: 'research' },
  ];

  if (view === 'resource-navigator') {
    return (
      <div className="min-h-screen bg-paper font-serif relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/soft-wallpaper.png')] opacity-10 mix-blend-multiply" />
        
        {/* Navigator Nav */}
        <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-border-gold/30 px-6 py-4 flex justify-between items-center shadow-lg no-print">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('main')}
              className="text-gold hover:text-cinnabar transition-all p-2 border border-gold hover:border-cinnabar rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold tracking-widest text-ink text-base hidden md:inline">教学资源 · 联考/校本资源导航</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('main')} className="text-sm font-bold text-ink hover:text-cinnabar">工作室首页</button>
          </div>
        </nav>

        <div className="max-w-[1400px] mx-auto px-4 py-8 relative z-10">
          <ResourceNavigator />
        </div>

        <footer className="py-12 text-center text-sm text-gold font-bold opacity-60 border-t border-border-gold/20 no-print">
          锦水微澜名师工作室 · 教学资源互通平台
        </footer>
      </div>
    );
  }
  if (view === 'book-detail') {
    return (
      <div className="min-h-screen bg-paper font-serif relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/soft-wallpaper.png')] opacity-10 mix-blend-multiply" />
        
        {/* Detail Nav */}
        <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-border-gold/30 px-6 py-4 flex justify-between items-center shadow-lg no-print">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => subView === 'index' ? setView('books') : setSubView('index')}
              className="text-gold hover:text-cinnabar transition-all p-2 border border-gold hover:border-cinnabar rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold tracking-widest text-ink text-base hidden md:inline">《钢铁是怎样炼成的》题库专研</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('main')} className="text-sm font-bold text-ink hover:text-cinnabar">工作室首页</button>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          <MasterpieceViewer bookId={selectedBook} subView={subView} onSubViewChange={setSubView} />
        </div>

        <footer className="py-12 text-center text-sm text-gold font-bold opacity-60 border-t border-border-gold/20 no-print">
          锦水微澜名师工作室 · 数字化教研成果
        </footer>
      </div>
    );
  }

  if (view === 'books') {
    return (
      <div className="min-h-screen bg-paper font-serif relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/soft-wallpaper.png')] opacity-10 mix-blend-multiply" />
        
        {/* Books Nav */}
        <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-border-gold/30 px-6 py-4 flex justify-between items-center shadow-lg no-print">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('main')}
              className="text-gold hover:text-cinnabar transition-all p-2 border border-gold hover:border-cinnabar rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-bold tracking-widest text-ink text-base hidden md:inline">名著导读 · 经典书目库</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setView('main')} className="text-sm font-bold text-ink hover:text-cinnabar">工作室首页</button>
          </div>
        </nav>
        
        <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
          <motion.div 
            initial="hidden" animate="visible" variants={containerVariants}
            className="flex flex-col h-full"
          >
            <motion.div variants={itemVariants} className="mb-8 md:mb-12 text-center md:text-left">
              <h1 className="text-4xl md:text-7xl font-calligraphy tracking-wide">名著导读 · <span className="text-cinnabar font-bold transition-all">经典目录</span></h1>
              <p className="text-gold font-bold tracking-[0.2em] md:tracking-[0.3em] mt-2 md:mt-4 opacity-60 text-xs md:text-base">CLASSIC LITERATURE DIRECTORY</p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="divide-y divide-border-gold/20 bg-white/40 backdrop-blur-md p-4 md:p-10 border border-border-gold shadow-2xl">
              <BookRow 
                title="《钢铁是怎样炼成的》" 
                author="奥斯特洛夫斯基" 
                type="理想信念" 
                desc="一部鼓舞了数代人的红色经典，探索生命的意义。" 
                onSelect={() => { setSelectedBook('gangtie'); setView('book-detail'); setSubView('index'); }}
              />
              <BookRow title="《西游记》" author="吴承恩" type="古典精粹" desc="奇幻浪漫的史诗，中国古典神魔小说的巅峰。" />
              <BookRow title="《骆驼祥子》" author="老舍" type="现实主义" desc="旧北京的人力车夫，个人奋斗与社会悲剧的交织。" />
              <BookRow title="《红岩》" author="罗广斌 / 杨益言" type="革命豪情" desc="不朽的烈士丰碑，江姐、许云峰的英勇壮举。" />
              <BookRow title="《水浒传》" author="施耐庵" type="英雄传奇" desc="替天行道，一百零八位草莽英雄的聚散离合。" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="scrolling-page font-serif">
      {/* Navigation */}
    <nav className="nav-header no-print">
        <div className="flex items-center gap-2 md:gap-4 truncate">
          <Logo className="w-8 h-6 md:w-16 md:h-12" />
          <span className="font-bold tracking-widest text-ink text-sm md:text-xl truncate">锦水微澜名师工作室</span>
        </div>
        
        {/* Mobile menu trigger */}
        <button 
          className="md:hidden p-2 text-ink"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex gap-12 text-base uppercase tracking-[0.4em] font-bold text-ink">
          {menuItems.map(item => (
            <button 
              key={item.name}
              onClick={() => item.action ? item.action() : document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' })}
              className="relative group hover:text-cinnabar transition-colors cursor-pointer py-2 px-1"
            >
              <span>{item.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cinnabar transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 w-full bg-paper border-b border-border-gold/30 shadow-2xl flex flex-col p-6 z-50 md:hidden"
            >
              {menuItems.map(item => (
                <button 
                  key={item.name}
                  onClick={() => {
                    if (item.action) item.action();
                    else document.getElementById(item.id!)?.scrollIntoView({ behavior: 'smooth' });
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-4 text-left border-b border-border-gold/10 text-ink font-bold tracking-[0.3em]"
                >
                  {item.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section - Balanced Ink Wash & Educational Focus */}
      <header className="relative bg-paper overflow-hidden py-24 md:py-56 px-6 border-b border-border-gold/15">
        {/* Ink Wash Mountains Effect (山水) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex items-end justify-center">
          <div className="w-full h-2/3 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-ink via-transparent to-transparent blur-3xl transform skew-y-2 translate-y-20" />
          <div className="absolute bottom-10 left-0 w-full h-[30%] bg-gradient-to-t from-paper to-transparent z-10" />
        </div>
        
        {/* Bamboo Branches (竹枝) */}
        <div className="absolute top-0 right-[10%] bottom-0 w-px bg-gradient-to-b from-transparent via-border-gold/30 to-transparent pointer-events-none hidden lg:block opacity-40">
          {[15, 40, 65, 85].map((top, i) => (
            <div 
              key={top} 
              className="absolute w-12 h-px bg-ink/20 -left-6" 
              style={{ 
                top: `${top}%`, 
                transform: `rotate(${i % 2 === 0 ? 15 : -15}deg)`,
                opacity: 0.3 + (i * 0.1)
              }} 
            />
          ))}
        </div>

        {/* Large Decorative Character Background */}
        <div className="absolute top-1/2 left-4 md:left-10 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
          <span className="text-[12rem] md:text-[35rem] font-calligraphy leading-none">语</span>
        </div>

        <div className="max-w-6xl mx-auto relative z-20 text-center md:text-left mt-8 md:mt-0">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1.2 }}
            className="flex flex-col gap-6 md:gap-10"
          >
            <div>
              <div className="flex items-center gap-3 mb-4 md:mb-6 justify-center md:justify-start">
                <div className="w-6 md:w-10 h-[2px] bg-cinnabar" />
                <span className="text-cinnabar tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-sm font-bold">语文教育中心 · 锦水微澜</span>
              </div>
              
              <h1 className="text-2xl sm:text-5xl md:text-8xl font-serif text-ink tracking-tight leading-[1.4] md:leading-normal">
                <span className="inline-block whitespace-nowrap">专注<span className="text-cinnabar font-calligraphy mx-1 md:mx-2 text-3xl sm:text-6xl md:text-9xl">语文</span>学习</span><br className="md:hidden" />
                <span className="inline-block whitespace-nowrap">深耕教研三十载</span>
              </h1>
            </div>

            <p className="text-ink/80 text-sm md:text-xl leading-relaxed md:leading-loose tracking-[0.1em] md:tracking-[0.3em] font-medium border-l-2 border-gold/30 pl-4 md:pl-6 max-w-full md:max-w-lg italic mx-auto md:mx-0">
              <span className="whitespace-nowrap">名著导读</span> · <span className="whitespace-nowrap">汉字听写</span> · <span className="whitespace-nowrap">读书会</span><br />
              让学习看得见，让文化润心田
            </p>
          </motion.div>
        </div>
        
        {/* Subtle scroll guide */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30 flex flex-col items-center">
          <div className="w-px h-16 bg-gold" />
          <span className="text-sm text-gold tracking-[0.5em] mt-3 uppercase font-bold">向下滑动</span>
        </div>
        
        {/* Subtle Bottom Line Ornament */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      </header>

      <div className="content-frame">
        
        {/* About Section */}
        <section id="about" className="section-container">
          <div className="relative">
            <div className="vertical-label">ABOUT FOUNDER</div>
            <div className="ornament-line" />
            <h2 className="text-3xl md:text-5xl font-calligraphy mb-8 md:mb-12">主理人 · <span className="text-cinnabar">黄国荣</span></h2>
            
            <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-start">
              <div className="md:col-span-4 md:sticky top-24">
                <div className="gold-border p-6 md:p-8 bg-white/20">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-ink text-paper rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold mb-4 md:mb-6 mx-auto">黄</div>
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-1 md:mb-2 text-ink">黄国荣</h3>
                  <p className="text-base md:text-lg text-center text-gray-900 leading-relaxed font-bold">中学语文高级教师<br />江西省省优秀课题主持人<br />上高县名师工作室主理人</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-border-gold/30">
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-cinnabar">30+</div>
                      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-tighter">年教龄</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-cinnabar">3项</div>
                      <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-tighter">结题课题</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-8">
                <div className="prose prose-stone leading-relaxed md:leading-loose text-ink text-sm md:text-lg font-normal space-y-4 md:space-y-6">
                  <p>先后任教于<strong>上高中学、上高县锦阳中学</strong>。深耕语文教育三十余载，从2014年至今，一直担任上高县初中语文名师团队（初中语文名师工作室）负责人，并任上高县教体局兼职教研员。</p>
                  <p>主持三项省级课题获结题，其中<strong>《汉字词语听写训练工具的多场景运用研究》</strong>于2025年12月结题，并被评为<strong>省优秀课题</strong>。致力于教育教研改革创新，在教师培训、校园文化建设、家庭教育指导、学生心理咨询等方面取得多项重要成果。</p>
                  <p>近年来，积极投身教育技术创新，运用抖音平台（黄老师家庭教育）推广汉字听写训练工具，<strong>运用AI编程制作大量教学APP</strong>，助力智慧教育发展。与上高县家庭教育指导中心深度合作，深入多所学校开展家庭教育讲座，为学生及家长提供专业的家庭教育指导和心理咨询服务。组织开展公益读书会活动，引导学生通过做读书笔记养成良好学习习惯，有效提升学习内驱力，为学生的终身学习奠定基础。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section id="resources" className="section-container px-4">
          <div className="ornament-line" />
          <h2 className="text-2xl md:text-5xl font-calligraphy mb-4">资源导航 · <span className="text-cinnabar">锦水微澜</span></h2>
          <p className="text-[10px] md:text-base text-gray-900 tracking-[0.1em] md:tracking-[0.3em] uppercase mb-8 md:mb-12 font-bold">Resource Directory & Content Hub</p>
          
          <div className="feature-grid grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            <ResourceCard id="resources" icon={<Scroll />} title="教学资源" desc="单元课文、全套试卷、古诗词及作文范文资源。" color="border-prestige-sage" action={() => setView('resource-navigator')} />
            <ResourceCard id="hanzi" icon={<PenTool />} title="汉字听写" desc="《汉字听写》工具书与训练视频，上高县品牌赛事。" color="border-prestige-gold" />
            <ResourceCard id="shici" icon={<Trophy />} title="诗词大会" desc="经典言论解读与古诗文默写，全能竞赛备考手册。" color="border-prestige-slate" />
            <ResourceCard id="bookshelf" icon={<BookOpen />} title="名著导读" desc="填空、选择、简答全覆盖，深海级名著题库解析。" color="border-prestige-rose" action={() => setView('books')} />
            <ResourceCard id="reading" icon={<Users />} title="读书会" desc="公益读书活动，笔记分享与交流，打造书香校园。" color="border-prestige-ink" />
            <ResourceCard id="research" icon={<GraduationCap />} title="课题研究" desc="省级课题研究成果，省优秀结题报告及应用案例。" color="border-prestige-purple" />
          </div>
        </section>

        {/* Recent Highlights */}
        <section id="recent" className="section-container">
          <div className="ornament-line" />
          <h2 className="text-3xl md:text-5xl font-calligraphy mb-8 md:mb-12">近期动态 · <span className="text-cinnabar">最新成果</span></h2>
          <div className="space-y-4 md:space-y-6">
            <div className="gold-border p-6 md:p-10 border-l-[4px] border-l-green-800 bg-white/20">
              <h4 className="text-lg md:text-2xl font-bold text-ink mb-2 md:mb-4">🏅 省优秀课题结题</h4>
              <p className="text-sm md:text-lg text-ink leading-relaxed md:leading-loose font-medium">
                《汉字词语听写训练工具的多场景运用研究》于2025年12月正式结题，被评为省优秀课题。
              </p>
            </div>
            <div className="gold-border p-6 md:p-10 border-l-[4px] border-l-gold bg-white/20">
              <h4 className="text-lg md:text-2xl font-bold text-ink mb-2 md:mb-4">📱 智能教育应用</h4>
              <p className="text-sm md:text-lg text-ink leading-relaxed md:leading-loose font-medium">
                运用AI编程技术开发大量教学辅助APP，并利用抖音平台（黄老师家庭教育）推广汉字听写训练工具。
              </p>
            </div>
            <div className="gold-border p-6 md:p-10 border-l-[4px] border-l-blue-800 bg-white/20">
              <h4 className="text-lg md:text-2xl font-bold text-ink mb-2 md:mb-4">🤝 家庭教育与心理辅导</h4>
              <p className="text-sm md:text-lg text-ink leading-relaxed md:leading-loose font-medium">
                与县家庭教育指导中心深度合作，开展专题讲座及心理咨询服务，助力学生健康成长。
              </p>
            </div>
          </div>
        </section>

      </div>

      <footer className="bg-paper-dark py-12 md:py-20 text-center border-t border-border-gold/30 no-print">
        <Logo className="w-16 h-14 md:w-24 md:h-20 mx-auto mb-6 md:mb-8" />
        <p className="text-base md:text-lg tracking-[0.2em] md:tracking-[0.5em] text-ink mb-2 font-bold px-4">锦水微澜名师工作室 · 黄国荣 编制</p>
        <p className="text-xs md:text-sm uppercase text-ink font-bold tracking-[0.4em] md:tracking-[0.8em]">Jiangxi Shanggao</p>
      </footer>
    </div>
  );
}

function ResourceNavigator() {
  const [filter, setFilter] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedGrade, setSelectedGrade] = useState<string>("7-down");

  const data = RESOURCES_DATA;

  const grades = [
    { id: '7-up', label: '七年级上' },
    { id: '7-down', label: '七年级下' },
    { id: '8-up', label: '八年级上' },
    { id: '8-down', label: '八年级下' },
    { id: '9-up', label: '九年级上' },
    { id: '9-down', label: '九年级下' },
  ];

  const filterItem = (item: any) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    return (
      item.title?.toLowerCase().includes(search) || 
      item.displayName?.toLowerCase().includes(search)
    );
  };

  const renderCard = (title: string, items: any[], id: string) => {
    const filteredItems = items.filter(filterItem);
    if (filteredItems.length === 0) return null;

    return (
      <div key={id} id={id} className="gold-border bg-white/70 overflow-hidden flex flex-col group transition-all hover:shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="px-6 md:px-8 py-4 md:py-5 border-b border-border-gold/20 flex items-center justify-between bg-paper-dark/10">
          <span className="text-xl md:text-2xl font-bold text-ink tracking-[0.1em]">{title}</span>
        </div>
        <div className="divide-y divide-border-gold/5 py-3 md:py-4">
          {filteredItems.map((item, idx) => (
            <a 
              key={idx} 
              href={item.file} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between px-6 md:px-8 py-3 md:py-4 hover:bg-gold/5 transition-colors group/item"
            >
              <span className="text-lg md:text-xl font-medium text-ink/80 group-hover/item:text-cinnabar transition-colors truncate">
                {item.title || item.displayName}
              </span>
              <span className="text-xs md:text-sm font-bold text-gold/60 group-hover/item:text-cinnabar transition-colors flex items-center shrink-0 tracking-[0.1em] md:tracking-[0.2em] ml-4 md:ml-6">
                打开 <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1" />
              </span>
            </a>
          ))}
        </div>
      </div>
    );
  };

  const unitItems = [
    { id: 'unit-1', label: '第一单元', unit: 1 },
    { id: 'unit-2', label: '第二单元', unit: 2 },
    { id: 'unit-3', label: '第三单元', unit: 3 },
    { id: 'unit-4', label: '第四单元', unit: 4 },
    { id: 'unit-5', label: '第五单元', unit: 5 },
    { id: 'unit-6', label: '第六单元', unit: 6 },
  ];

  const specialItems = [
    { id: 'classic', label: '名著导读' },
    { id: 'exam', label: '单元试卷' },
    { id: 'practice', label: '单元小练' },
    { id: 'composition', label: '单元作文' },
    { id: 'extra-wenyan', label: '课外文言' },
    { id: 'poetry', label: '古诗赏析' },
  ];

  const allItems = [...unitItems, ...specialItems];

  interface NavButtonProps {
    item: { id: string; label: string; unit?: number };
    key?: string | number;
  }

  const NavButton = ({ item }: NavButtonProps) => (
    <button 
      onClick={() => { setActiveTab(item.id); setFilter(""); }}
      className={`px-4 md:px-8 py-2.5 md:py-3.5 rounded-full text-sm md:text-base font-bold tracking-[0.1em] md:tracking-[0.2em] transition-all border ${activeTab === item.id ? 'bg-ink border-ink text-white shadow-xl scale-105' : 'bg-white border-border-gold/30 text-ink hover:border-cinnabar hover:text-cinnabar'}`}
    >
      {item.label}
    </button>
  );

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigator Top Section */}
      <div className="bg-ink p-10 md:p-24 relative overflow-hidden text-center rounded-xl shadow-2xl">
        <Logo className="w-16 h-14 md:w-28 md:h-24 mx-auto mb-6 md:mb-10 bg-white/5 p-2 md:p-4 rounded-lg" />
        <h1 className="text-3xl md:text-8xl font-bold tracking-[0.1em] md:tracking-[0.35em] text-paper mb-4 md:mb-8">教学资源导航</h1>
        <p className="text-paper/40 text-sm md:text-xl tracking-[0.2em] md:tracking-[0.8em] mb-8 md:mb-16 font-light italic">教研同步 / 优质资源共享</p>
        
        {/* Search Bar */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 text-gold/30" />
            <input 
              type="text" 
              placeholder="搜索教学资源..." 
              value={filter}
              onChange={(e) => { setFilter(e.target.value); if(e.target.value) setActiveTab('all'); }}
              className="w-full bg-white/5 border border-white/10 rounded-full py-4 md:py-7 pl-14 md:pl-20 pr-6 md:pr-10 text-paper text-lg md:text-2xl outline-none focus:border-gold/50 focus:bg-white/10 transition-all placeholder:text-paper/20 font-light"
            />
          </div>
        </div>
      </div>

      {/* Grade Selection Row */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 bg-paper-dark/20 p-2 rounded-2xl border border-border-gold/10 shadow-inner">
          {grades.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              className={`flex-1 min-w-[100px] md:min-w-[120px] px-4 md:px-6 py-3 md:py-4 rounded-xl text-base md:text-lg font-bold tracking-[0.2em] md:tracking-[0.4em] transition-all ${
                selectedGrade === g.id 
                  ? 'bg-cinnabar text-white shadow-lg scale-105' 
                  : 'text-ink/40 hover:text-cinnabar hover:bg-white/50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Navigation */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pb-10 px-4">
        {/* 'All' Button as a balanced vertical seal */}
        <div className="flex shrink-0 px-4">
          <button 
            onClick={() => { setActiveTab('all'); setFilter(""); }}
            className={`flex flex-row md:flex-col items-center justify-center gap-3 group transition-all ${activeTab === 'all' ? 'text-cinnabar' : 'text-gold hover:text-cinnabar'}`}
          >
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 flex items-center justify-center transition-all ${activeTab === 'all' ? 'border-cinnabar bg-cinnabar text-white shadow-xl' : 'border-gold/30'}`}>
              <Layout className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="md:writing-vertical text-base md:text-lg font-bold tracking-[0.2em] md:tracking-[0.6em] transition-colors whitespace-nowrap">全部资源</span>
          </button>
        </div>

        <div className="w-px h-32 bg-border-gold/20 hidden md:block" />
        <div className="w-full h-px bg-border-gold/20 md:hidden" />

        {/* 6+6 Balanced Groups */}
        <div className="space-y-6 md:space-y-8 flex-1 max-w-5xl w-full">
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-center">
            {unitItems.map(item => <NavButton key={item.id} item={item} />)}
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-center">
            {specialItems.map(item => <NavButton key={item.id} item={item} />)}
          </div>
        </div>
      </div>

      {/* Filter Active Breadcrumb */}
      {activeTab !== 'all' && (
        <div className="flex items-center justify-center gap-4 px-2">
          <span className="text-sm font-bold text-ink/30 tracking-[0.2em] uppercase">已筛选</span>
          <div className="bg-paper-dark border border-border-gold/20 text-ink px-6 py-2 rounded-full text-sm font-bold flex items-center gap-3">
            {allItems.find(i => i.id === activeTab)?.label}
            <button onClick={() => setActiveTab('all')} className="hover:text-cinnabar transition-colors">
              <ArrowLeft className="w-4 h-4 rotate-45" />
            </button>
          </div>
          <button onClick={() => setActiveTab('all')} className="text-sm text-cinnabar font-bold hover:underline transition-all underline-offset-4">
            返回
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {selectedGrade === '7-down' ? (
          <>
            {/* Textbook Units */}
            {([1, 2, 3, 4, 5, 6]).map(u => {
              const tabId = `unit-${u}`;
              if (activeTab !== 'all' && activeTab !== tabId) return null;
              return renderCard((UNIT_NAMES as any)[u], data.textbook.filter(i => i.unit === u), `card-unit-${u}`);
            })}

            {/* Special Categories */}
            {(activeTab === 'all' || activeTab === 'classic') && renderCard("名著导读", data.classics, "card-classic")}
            {(activeTab === 'all' || activeTab === 'exam') && renderCard("单元试卷", data.examPapers, "card-exam")}
            {(activeTab === 'all' || activeTab === 'practice') && renderCard("单元小练", data.unitPractices, "card-practice")}
            {(activeTab === 'all' || activeTab === 'composition') && renderCard("单元作文", data.compositions, "card-composition")}
            {(activeTab === 'all' || activeTab === 'extra-wenyan') && renderCard("课外文言", data.extracurricular, "card-extra-wenyan")}
            {(activeTab === 'all' || activeTab === 'poetry') && renderCard("古诗赏析", data.poetry, "card-poetry-analysis")}
          </>
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 py-32 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 bg-paper-dark/20 rounded-full flex items-center justify-center mx-auto">
                <Book className="w-10 h-10 text-gold/30" />
              </div>
              <p className="text-2xl font-bold text-ink/40 tracking-[0.5em]">资源建设中</p>
              <p className="text-ink/20 tracking-[0.2em]">{grades.find(g => g.id === selectedGrade)?.label} 内容正在整理，敬请期待</p>
              <button 
                onClick={() => setSelectedGrade('7-down')}
                className="text-cinnabar font-bold tracking-[0.3em] hover:underline underline-offset-8 transition-all"
              >
                查看七年级下资源
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="py-12 border-t border-border-gold/10 text-center text-ink/30 text-sm font-light tracking-[0.5em]">
        锦水微澜名师工作室 · 教学资源库同步平台
      </div>
    </div>
  );
}

function BookRow({ title, author, type, desc, onSelect }: { title: string, author: string, type: string, desc: string, onSelect?: () => void }) {
  return (
    <div 
      onClick={onSelect}
      className="group block p-4 md:p-6 hover:bg-white/40 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2 gap-4">
        <h4 className="text-lg md:text-2xl font-bold text-ink group-hover:text-cinnabar transition-all leading-tight">{title}</h4>
        <span className="text-[10px] md:text-xs text-cinnabar border border-cinnabar/40 px-2 md:px-3 py-0.5 md:py-1 rounded-full uppercase tracking-tighter md:tracking-widest font-bold whitespace-nowrap shrink-0">{type}</span>
      </div>
      <p className="text-xs md:text-sm text-gold font-bold mb-2 md:mb-3">{author}</p>
      <p className="text-xs md:text-sm text-gray-700 opacity-90 group-hover:opacity-100 transition-opacity leading-relaxed">{desc}</p>
    </div>
  );
}

function MasterpieceViewer({ bookId, subView, onSubViewChange }: { bookId: string, subView: BookSubView, onSubViewChange: (v: BookSubView) => void }) {
  if (bookId !== 'gangtie') return <div className="text-center py-20">暂无内容</div>;

  const data = GANGTIE_DATA;

  const PrintButton = () => (
    <button 
      onClick={() => window.print()} 
      className="no-print fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] bg-cinnabar text-white h-12 md:h-16 flex items-center justify-center rounded-full shadow-2xl hover:scale-105 transition-all group overflow-hidden px-4 md:px-5"
      title="打印当前页面"
    >
      <div className="flex items-center justify-center">
        <Printer className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 whitespace-nowrap font-bold text-sm md:text-base">打印存档</span>
    </button>
  );

  if (subView === 'index') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PrintButton />
        <div className="bg-green-900 overflow-hidden relative rounded-xl p-8 md:p-12 text-center text-white shadow-2xl">
          <div className="absolute top-4 right-8 text-6xl md:text-8xl font-serif opacity-10">钢</div>
          <div className="w-16 h-24 md:w-20 md:h-28 bg-white/20 border border-white/30 rounded flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 mx-auto shadow-inner shadow-green-400/20">📗</div>
          <h1 className="text-2xl md:text-5xl font-bold tracking-widest mb-4">《钢铁是怎样炼成的》</h1>
          <p className="text-white/60 text-xs md:text-sm tracking-widest">奥斯特洛夫斯基 著 · 八年级下册必读名著</p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8">
            {['填空题 50空', '选择题 50题', '简答题 25题', '分析题 5题', '深度解读', '答案详解', '一键全印'].map(tag => (
              <span key={tag} className="text-[10px] md:text-xs px-3 md:px-4 py-1 md:py-1.5 bg-white/10 rounded-full border border-white/10">{tag}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <button onClick={() => onSubViewChange('choice')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl">
            <div className="w-10 md:w-12 h-1 bg-cinnabar mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-cinnabar">选择题专练</h3>
            <p className="text-gray-600 text-xs md:text-sm">共{data.choiceQuestions.length}题 · 四选一 · 自动分页优化</p>
          </button>
          <button onClick={() => onSubViewChange('fill-blank')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl">
            <div className="w-10 md:w-12 h-1 bg-teal-600 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-teal-600">填空题挑战</h3>
            <p className="text-gray-600 text-xs md:text-sm">共{data.fillInBlanksQuestions?.length || 50}题 · 基础巩固 · 考点直击</p>
          </button>
          <button onClick={() => onSubViewChange('short-answer')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl">
            <div className="w-10 md:w-12 h-1 bg-gold mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-gold">简答与分析题</h3>
            <p className="text-gray-600 text-xs md:text-sm">共{data.shortAnswerQuestions.length}题 · 深度考察 · 附答题线设计</p>
          </button>
          <button onClick={() => onSubViewChange('interpretation')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl">
            <div className="w-10 md:w-12 h-1 bg-blue-800 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-blue-800">深度文化解读</h3>
            <p className="text-gray-600 text-xs md:text-sm">人物分析 · 主题梳理 · 中考考点归纳</p>
          </button>
          <button onClick={() => onSubViewChange('answer')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl">
            <div className="w-10 md:w-12 h-1 bg-green-800 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-green-800">标准答案详解</h3>
            <p className="text-gray-600 text-xs md:text-sm">完整版答案 · 选择、填空、主观题汇总</p>
          </button>
          <button onClick={() => onSubViewChange('all')} className="group gold-border p-6 md:p-8 text-left hover:bg-white transition-all shadow-md hover:shadow-xl md:col-span-2 border-cinnabar/30 bg-cinnabar/5">
            <div className="w-12 h-1 bg-ink opacity-30 mb-3 md:mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-cinnabar">一键生成全书打印版</h3>
            <p className="text-gray-600 text-xs md:text-sm">集合所有练习、解析与答案 · 自动分页排版 · 考试/资料自制神器</p>
          </button>
        </div>

        <div className="gold-border p-8 bg-paper-texture border-l-4 border-l-gold">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Scroll className="w-5 h-5" /> 使用说明</h4>
          <div className="space-y-4 text-ink/80 text-sm">
            <p>📱 <strong>在线研习：</strong>直接点击上方模块即可在当前页面深入学习。</p>
            <p>🖨️ <strong>打印支持：</strong>页面已针对 A4 纸张进行排版优化，点击右下角“打印”按钮即可。</p>
            <p>🌟 <strong>教研共享：</strong>本资源由锦水微澜名师工作室黄国荣老师倾力编制。</p>
          </div>
        </div>
      </div>
    );
  }

  if (subView === 'choice') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 overflow-x-auto pb-20">
        <PrintButton />
        <div className="legacy-paper">
          {/* ================= 第一面：选择题 第1-23题 ================= */}
          <div className="legacy-page">
            <div className="legacy-main-title">
              <h1>《钢铁是怎样炼成的》选择题专练</h1>
              <div className="legacy-subhead">奥斯特洛夫斯基 · 红色经典 · 八年级下册必读名著 | 锦水微澜教育工作室 黄国荣 编制</div>
            </div>

            <div className="legacy-ans-section-title">🔘 二、选择题（共50题）</div>
            <div className="legacy-questions-list">
              {data.choiceQuestions.slice(0, 23).map((q, idx) => (
                <div key={idx} className="legacy-q-item">
                  {q}
                </div>
              ))}
            </div>
            <div className="legacy-print-footer">本页为第1-23题 | 背面为第24-50题</div>
            <div className="legacy-page-number">—— 第1页 / 共2页（正面）——</div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 my-8 no-print" />

          {/* ================= 第二面：选择题 第24-50题 ================= */}
          <div className="legacy-page">
            <div className="legacy-questions-list" style={{ marginTop: 0 }}>
              {data.choiceQuestions.slice(23).map((q, idx) => (
                <div key={idx} className="legacy-q-item">
                  {q}
                </div>
              ))}
            </div>
            <div className="legacy-print-footer">本页为第24-50题 | 选择题共50题</div>
            <div className="legacy-page-number">—— 第2页 / 共2页（背面）——</div>
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'fill-blank') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 overflow-x-auto pb-20">
        <PrintButton />
        <div className="legacy-paper">
          {/* ================= 第一面：填空题 第1-23题 ================= */}
          <div className="legacy-page">
            <div className="legacy-main-title">
              <h1>《钢铁是怎样炼成的》填空题专练</h1>
              <div className="legacy-subhead">奥斯特洛夫斯基 · 红色经典 · 八年级下册必读名著 | 锦水微澜教育工作室 黄国荣 编制</div>
            </div>

            <div className="legacy-ans-section-title">📝 一、填空题（共50空）</div>
            <div className="legacy-questions-list">
              {data.fillInBlanksQuestions?.slice(0, 23).map((q, idx) => (
                <div key={idx} className="legacy-q-item">
                  {q.split('（ ）')[0]}<span className="legacy-blank">__________</span>{q.split('（ ）')[1]}
                </div>
              ))}
            </div>
            <div className="legacy-print-footer">本页为第1-23题 | 背面为第24-50题</div>
            <div className="legacy-page-number">—— 第1页 / 共2页（正面）——</div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 my-8 no-print" />

          {/* ================= 第二面：填空题 第24-50题 ================= */}
          <div className="legacy-page">
            <div className="legacy-questions-list" style={{ marginTop: 0 }}>
              {data.fillInBlanksQuestions?.slice(23).map((q, idx) => (
                <div key={idx} className="legacy-q-item">
                  {q.split('（ ）')[0]}<span className="legacy-blank">__________</span>{q.split('（ ）')[1]}
                </div>
              ))}
            </div>
            <div className="legacy-print-footer">本页为第24-50题 | 填空题共50空</div>
            <div className="legacy-page-number">—— 第2页 / 共2页（背面）——</div>
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'interpretation') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 overflow-x-auto pb-20">
        <PrintButton />
        <div className="legacy-paper">
          {/* ================= 正面（第1页） ================= */}
          <div className="legacy-page">
            <div className="legacy-main-title">
              <h1>钢铁是怎样炼成的</h1>
              <div className="legacy-subhead">奥斯特洛夫斯基 · 红色经典 · 生命的意义</div>
              <div className="legacy-author-line">尼古拉·奥斯特洛夫斯基 著 | 八年级下册语文必读名著 · 深度解读 | 锦水微澜教育工作室 黄国荣 编制</div>
            </div>

            <div className="legacy-quote">
              <span className="legacy-strong">📖 编撰说明</span><br />
              《钢铁是怎样炼成的》是苏联作家奥斯特洛夫斯基的代表作，是一部闪烁着崇高理想主义光芒的长篇小说。小说以作者自身经历为蓝本，塑造了保尔·柯察金这一无产阶级英雄形象。本文根据原著及权威资料整理，系统梳理故事梗概、人物形象、主题思想、艺术特色及中考考点，便于读者研习或打印装订。
            </div>

            {/* 作者简介 */}
            <div className="legacy-section">
              <div className="legacy-section-title">✍️ 一、作者简介</div>
              <div className="legacy-compact-p"><span className="legacy-strong">尼古拉·阿列克谢耶维奇·奥斯特洛夫斯基</span>（1904—1936），苏联著名无产阶级作家。他出生于乌克兰一个贫困的工人家庭，11岁开始当童工，1919年加入共青团，参加国内战争。1920年在战斗中重伤，23岁时双目失明，身体瘫痪。但他以惊人的毅力，在病榻上历时三年创作了《钢铁是怎样炼成的》。小说完成后，他又开始创作《暴风雨所诞生的》，但未完成便因病逝世，年仅32岁。</div>
            </div>

            {/* 故事梗概 */}
            <div className="legacy-section">
              <div className="legacy-section-title">📖 二、故事梗概 · 保尔的成长之路</div>
              <div className="legacy-compact-p">小说以十月革命前后的俄国为背景，讲述了主人公保尔·柯察金的成长历程。</div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">🔨 童年时期 · 反抗的种子</div>
                <div className="legacy-compact-p">保尔因不满神父的虐待被学校开除，12岁到车站食堂当杂役，受尽压迫和剥削。在哥哥阿尔焦姆的帮助下，他逐渐认识到社会的黑暗。十月革命爆发后，老布尔什维克朱赫来来到小镇，向保尔传授革命思想，保尔从此走上革命道路。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">⚔️ 革命时期 · 钢铁的淬炼</div>
                <div className="legacy-compact-p">保尔加入红军，在战场上英勇作战，大腿受伤、头部中弹，但他以顽强意志战胜死亡。在战争间隙，他坚持学习，成长为一名优秀的骑兵。后因伤转入后方工作，参加修筑铁路的艰苦劳动，在严寒和饥饿中，他展现出惊人的毅力。小说中“筑路”一节是最为经典的篇章，集中体现了保尔的钢铁意志。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">💔 病重时期 · 精神的升华</div>
                <div className="legacy-compact-p">保尔因伤寒和斑疹伤寒险些丧命，后又因高强度工作导致身体恶化，双目失明、全身瘫痪。在极端困难的情况下，他一度产生自杀念头，但很快战胜了软弱。他拿起笔，开始了新的战斗——文学创作。在妻子达雅和母亲的帮助下，他完成了小说《暴风雨所诞生的》，用另一种方式继续为革命事业奋斗。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">✨ 生命的意义 · 不朽的名言</div>
                <div className="legacy-compact-p">保尔在烈士公墓前的一段独白成为全书最著名的段落：“人最宝贵的是生命，生命对人来说只有一次。人的一生应当这样度过：当他回首往事时，不会因为碌碌无为、虚度年华而悔恨，也不会因为为人卑劣、生活庸俗而愧疚。这样，在临死的时候，他就能够说：‘我已把自己整个的生命和全部的精力献给了世界上最壮丽的事业——为人类的解放而奋斗。’”</div>
              </div>
            </div>

            {/* 三、人物形象分析 */}
            <div className="legacy-section">
              <div className="legacy-section-title">👥 三、人物形象分析</div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">保尔·柯察金 · 钢铁战士的化身</div>
                <div className="legacy-compact-p">保尔是小说主人公，他的形象集中体现了无产阶级革命战士的崇高品质：顽强勇敢、意志坚定、对党忠诚、无私奉献。他具有强烈的反抗精神，从童年反抗神父，到青年时期投身革命，再到病重后拿起笔战斗，他的一生都在为理想而奋斗。保尔不是天生的英雄，他在斗争中不断成长，身上既有英雄主义的光辉，也有普通人的软弱与挣扎，但每一次他都能战胜自我，实现精神升华。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">朱赫来 · 革命引路人</div>
                <div className="legacy-compact-p">朱赫来是老布尔什维克，是保尔革命道路的引路人。他沉着冷静、经验丰富、善于引导青年。他教保尔拳击、讲革命道理，在保尔迷茫时给予指引，是保尔精神上的父亲。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">冬妮亚 · 初恋的幻灭</div>
                <div className="legacy-compact-p">冬妮亚是林务官的女儿，保尔的初恋。她天真、善良，但带有资产阶级小姐的习气。保尔与她因阶级立场不同而分手，体现了保尔对革命信仰的坚守。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">丽达 · 革命的战友</div>
                <div className="legacy-compact-p">丽达是共青团干部，与保尔志同道合。她干练、热情、有政治觉悟，是保尔理想的革命伴侣。但因误会两人未能走到一起，成为保尔一生的遗憾。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">达雅 · 生活的伴侣</div>
                <div className="legacy-compact-p">达雅是保尔的妻子，在保尔病重后给予他无微不至的照顾。她淳朴、善良、坚韧，在保尔的帮助下成长为共产党员，是保尔晚年生活的精神支柱。</div>
              </div>
              
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">阿尔焦姆 · 亲情的力量</div>
                <div className="legacy-compact-p">阿尔焦姆是保尔的哥哥，一个朴实的工人。他爱护弟弟，在保尔成长过程中给予物质和精神上的支持，代表了工人阶级的质朴与力量。</div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 my-8 no-print" />

          {/* ================= 背面（第2页） ================= */}
          <div className="legacy-page">
            {/* 四、主题思想 */}
            <div className="legacy-section">
              <div className="legacy-section-title">💡 四、主题思想</div>
              <div className="legacy-highlight-box">
                <div className="legacy-compact-p"><span className="legacy-strong">钢铁意志的赞歌</span>：小说通过保尔的成长历程，歌颂了无产阶级革命者钢铁般的意志。保尔在战争中负伤、在建设中牺牲健康、在病重后坚持创作，每一次困境都是对意志的淬炼，正如书名所喻：“钢铁是在烈火和急冷中炼成的。”</div>
                <div className="legacy-compact-p"><span className="legacy-strong">生命价值的追问</span>：保尔关于“人最宝贵的是生命”的独白，引发了无数读者对生命意义的思考。小说回答了“人应该怎样活着”这一根本问题——为崇高理想而奋斗，生命才有价值。</div>
                <div className="legacy-compact-p"><span className="legacy-strong">革命英雄主义</span>：小说展现了个人利益服从革命利益、个人命运融入时代洪流的英雄主义精神。保尔放弃爱情、牺牲健康，始终把党 and 人民的事业放在首位。</div>
                <div className="legacy-compact-p"><span className="legacy-strong">理想主义的丰碑</span>：小说超越了个人命运，表达了对共产主义理想的坚定信念。保尔的奋斗历程证明：崇高的理想可以战胜一切困难。</div>
              </div>
            </div>

            {/* 五、艺术特色 */}
            <div className="legacy-section">
              <div className="legacy-section-title">🎨 五、艺术特色</div>
              <div className="legacy-subsection">
                <div className="legacy-subsection-title">自传体小说的真实力量</div>
                <div className="legacy-compact-p">小说以作者自身经历为蓝本，具有强烈的自传色彩。保尔的原型就是奥斯特洛夫斯基本人，这种源于真实经历的创作使小说具有震撼人心的力量。书中许多情节，如保尔参加修路、双目失明后写作等，都是作者亲身经历的写照。</div>
                
                <div className="legacy-subsection-title">心理描写的深度</div>
                <div className="legacy-compact-p">小说深入刻画了保尔的内心世界，展现了他的思想斗争和精神成长。特别是保尔在瘫痪后产生自杀念头的心理描写，真实展现了英雄人物内心的脆弱与挣扎，使人物形象更加立体丰满。</div>
                
                <div className="legacy-subsection-title">革命浪漫主义风格</div>
                <div className="legacy-compact-p">小说将现实主义的真实描写与浪漫主义的理想抒发相结合，在严酷的斗争现实中展现出崇高的理想光辉。语言充满激情，富有感染力，激励了一代又一代读者。</div>
                
                <div className="legacy-subsection-title">跌宕起伏的叙事结构</div>
                <div className="legacy-compact-p">小说以保尔的成长历程为主线，从童年到革命、从建设到病重、从绝望到新生，情节跌宕起伏，层层递进，有力地表现了“钢铁是怎样炼成的”这一主题。</div>
              </div>
            </div>

            {/* 六、经典名言 */}
            <div className="legacy-section">
              <div className="legacy-section-title">📜 六、经典名言</div>
              <div className="legacy-quote">
                <p>“人最宝贵的是生命，生命对人来说只有一次。人的一生应当这样度过：当他回首往事时，不会因为碌碌无为、虚度年华而悔恨，也不会因为为人卑劣、生活庸俗而愧疚。这样，在临终的时候，他就能够说：‘我已把自己整个的生命和全部的精力献给了世界上最壮丽的事业——为人类的解放而奋斗。’”</p>
                <p style={{ marginTop: '0.15rem' }}>—— 保尔·柯察金</p>
              </div>
              <div className="legacy-compact-p"><span className="legacy-strong">其他名句</span>：“钢是在烈火和急冷中炼成的，意志也是在苦难和斗争中磨炼出来的。”“任何一个傻瓜在任何时候都能结束自己！这是最怯弱也是最容易的出路。”</div>
            </div>

            {/* 七、中考考点归纳 */}
            <div className="legacy-section">
              <div className="legacy-section-title">📚 七、中考考点归纳</div>
              <div className="legacy-highlight-box">
                <ul className="list-disc ml-4 space-y-1">
                  <li className="legacy-compact-p"><strong>作者</strong>：奥斯特洛夫斯基（苏联），自传体小说。</li>
                  <li className="legacy-compact-p"><strong>主人公</strong>：保尔·柯察金，钢铁战士的象征。</li>
                  <li className="legacy-compact-p"><strong>核心事件</strong>：被学校开除→遇朱赫来→参加红军→头部受伤→参加筑路→全身瘫痪→双目失明→文学创作。</li>
                  <li className="legacy-compact-p"><strong>关键人物</strong>：朱赫来（革命引路人）、冬妮亚（初恋）、丽达（战友）、达雅（妻子）、阿尔焦姆（哥哥）。</li>
                  <li className="legacy-compact-p"><strong>经典名言</strong>：“人最宝贵的是生命……”（常考填空题/简答题）。</li>
                  <li className="legacy-compact-p"><strong>主题</strong>：歌颂钢铁意志、追问生命价值、弘扬革命英雄主义。</li>
                  <li className="legacy-compact-p"><strong>书名寓意</strong>：钢铁在烈火与急冷中炼成，比喻坚强的革命意志是在艰苦斗争中磨炼出来的。</li>
                  <li className="legacy-compact-p"><strong>艺术特色</strong>：自传体、心理描写、革命浪漫主义、语言激情澎湃。</li>
                </ul>
              </div>
            </div>

            {/* 八、深度思考 · 经典的意义 */}
            <div className="legacy-section">
              <div className="legacy-section-title">💭 八、深度思考 · 经典的意义</div>
              <div className="legacy-compact-p">《钢铁是怎样炼成的》不仅是一部文学名著，更是一部人生教科书。保尔·柯察金用他的一生诠释了什么是真正的英雄主义——在认清生活的真相后依然热爱生活，在遭受命运的打击后依然为理想奋斗。</div>
              <div className="legacy-compact-p">今天，我们生活在和平年代，不再需要像保尔那样浴血奋战，但他那种永不放弃、为理想而奋斗的精神依然具有现实意义。面对学习中的困难、生活中的挫折，保尔的精神告诉我们：只要心中有信念，就没有克服不了的困难。</div>
              <div className="legacy-compact-p">正如保尔所说：“钢是在烈火和急冷中炼成的。”每一个人的成长，都需要经历风雨的洗礼。愿我们都能在生活的熔炉中，炼就属于自己的“钢铁”。</div>
            </div>

            <div className="legacy-print-footer">依据奥斯特洛夫斯基《钢铁是怎样炼成的》原著及权威资料整理 · 涵盖中考全部考点 · 适宜装订成册</div>
            <div className="legacy-page-number">—— 共2页，双面打印 ——</div>
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'short-answer') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 overflow-x-auto pb-20">
        <PrintButton />
        <div className="legacy-paper">
          <div className="legacy-main-title">
            <h1>《钢铁是怎样炼成的》简答题+分析题专练</h1>
            <div className="legacy-subhead">奥斯特洛夫斯基 · 红色经典 · 八年级下册必读名著 | 名著阅读专项训练</div>
          </div>

          <div className="legacy-questions-container">
            {data.shortAnswerQuestions.map((q, idx) => (
              <div key={idx} className="legacy-question-item">
                <div className="legacy-q-title">{q}</div>
                <div className="legacy-answer-lines">
                  <div className="legacy-line"></div>
                  <div className="legacy-line"></div>
                  {idx >= 20 && <div className="legacy-line"></div>}
                </div>
                {idx === 22 && <div className="legacy-shift-down"></div>}
              </div>
            ))}
          </div>
          <div className="legacy-small-note !text-center">
            共25题（第1-20题为简答题，第21-25题为分析题）| 根据奥斯特洛夫斯基《钢铁是怎样炼成的》原著命题
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'answer') {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-500 overflow-x-auto pb-20">
        <PrintButton />
        <div className="legacy-paper">
          <h1>《钢铁是怎样炼成的》参考答案</h1>
          <div className="legacy-subhead">选择题+填空题（横排）&nbsp;&nbsp;|&nbsp;&nbsp;简答题+分析题（竖排，自然接续）</div>

          {/* ================= 一、选择题（横排，50题） ================= */}
          <div className="legacy-section">
            <div className="legacy-ans-section-title">一、选择题答案 (共50题)</div>
            <div className="legacy-grid-answers">
              {data.answers.choices.map((ans, idx) => (
                <div key={idx} className="legacy-grid-item">
                  <span className="legacy-strong">{idx + 1}.</span> {ans}
                </div>
              ))}
            </div>
          </div>

          {/* ================= 二、填空题（横排，50空） ================= */}
          <div className="legacy-section">
            <div className="legacy-ans-section-title">二、填空题答案 (共50空)</div>
            <div className="legacy-grid-answers">
              {data.answers.fillInBlanks.map((ans, idx) => (
                <div key={idx} className="legacy-grid-item">
                  <span className="legacy-strong">{idx + 1}.</span> {ans}
                </div>
              ))}
            </div>
          </div>

          {/* ================= 三、简答题（竖排，25题） ================= */}
          <div className="legacy-section">
            <div className="legacy-ans-section-title">三、简答与分析题答案</div>
            {data.shortAnswerDetailed.map((item, idx) => (
              <div key={idx} className="legacy-vertical-answer">
                <span className="answer-text">
                  {item.q}<br />
                  {item.a}
                </span>
              </div>
            ))}
          </div>

          <div className="legacy-small-note">✅ 选择题+填空题横排节省空间 | 简答题+分析题竖排自然接续 | 共50选择+50填空+25分析详解</div>
        </div>
      </div>
    )
  }

  if (subView === 'all') {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <PrintButton />
        <div className="bg-white p-12 space-y-16 print-page">
          {/* Header */}
          <div className="text-center border-b-4 border-double border-ink pb-8 mb-12">
            <h1 className="text-5xl font-bold mb-2 tracking-tighter">名著导读深度练习汇编 · 《钢铁是怎样炼成的》</h1>
            <p className="text-lg font-serif italic text-gray-700">锦水微澜名师工作室 黄国荣老师 精编系列</p>
          </div>

          {/* Section: Interpretation */}
          <section className="print-avoid-break">
            <h2 className="text-3xl font-bold border-b border-ink/20 pb-2 mb-6">壹 · 深度文化解读</h2>
            <div className="legacy-paper !shadow-none !p-0 !m-0">
              {/* ================= 正面（第1页） ================= */}
              <div className="legacy-page">
                <div className="legacy-main-title">
                  <h1>钢铁是怎样炼成的</h1>
                  <div className="legacy-subhead">奥斯特洛夫斯基 · 红色经典 · 生命的意义</div>
                  <div className="legacy-author-line">尼古拉·奥斯特洛夫斯基 著 | 八年级下册语文必读名著 · 深度解读 | 锦水微澜教育工作室 黄国荣 编制</div>
                </div>

                <div className="legacy-quote">
                  <span className="legacy-strong">📖 编撰说明</span><br />
                  《钢铁是怎样炼成的》是苏联作家奥斯特洛夫斯基的代表作，是一部闪烁着崇高理想主义光芒的长篇小说。小说以作者自身经历为蓝本，塑造了保尔·柯察金这一无产阶级英雄形象。本文根据原著及权威资料整理，系统梳理故事梗概、人物形象、主题思想、艺术特色及中考考点，便于读者研习或打印装订。
                </div>

                {/* 作者简介 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">✍️ 一、作者简介</div>
                  <div className="legacy-compact-p"><span className="legacy-strong">尼古拉·阿列克谢耶维奇·奥斯特洛夫斯基</span>（1904—1936），苏联著名无产阶级作家。他出生于乌克兰一个贫困的工人家庭，11岁开始当童工，1919年加入共青团，参加国内战争。1920年在战斗中重伤，23岁时双目失明，身体瘫痪。但他以惊人的毅力，在病榻上历时三年创作了《钢铁是怎样炼成的》。小说完成后，他又开始创作《暴风雨所诞生的》，但未完成便因病逝世，年仅32岁。</div>
                </div>

                {/* 故事梗概 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">📖 二、故事梗概 · 保尔的成长之路</div>
                  <div className="legacy-compact-p">小说以十月革命前后的俄国为背景，讲述了主人公保尔·柯察金的成长历程。</div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">🔨 童年时期 · 反抗的种子</div>
                    <div className="legacy-compact-p">保尔因不满神父的虐待被学校开除，12岁到车站食堂当杂役，受尽压迫和剥削。在哥哥阿尔焦姆的帮助下，他逐渐认识到社会的黑暗。十月革命爆发后，老布尔什维克朱赫来来到小镇，向保尔传授革命思想，保尔从此走上革命道路。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">⚔️ 革命时期 · 钢铁的淬炼</div>
                    <div className="legacy-compact-p">保尔加入红军，在战场上英勇作战，大腿受伤、头部中弹，但他以顽强意志战胜死亡。在战争间隙，他坚持学习，成长为一名优秀的骑兵。后因伤转入后方工作，参加修筑铁路的艰苦劳动，在严寒和饥饿中，他展现出惊人的毅力。小说中“筑路”一节是最为经典的篇章，集中体现了保尔的钢铁意志。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">💔 病重时期 · 精神的升华</div>
                    <div className="legacy-compact-p">保尔因伤寒和斑疹伤寒险些丧命，后又因高强度工作导致身体恶化，双目失明、全身瘫痪。在极端困难的情况下，他一度产生自杀念头，但很快战胜了软弱。他拿起笔，开始了新的战斗——文学创作。在妻子达雅和母亲的帮助下，他完成了小说《暴风雨所诞生的》，用另一种方式继续为革命事业奋斗。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">✨ 生命的意义 · 不朽的名言</div>
                    <div className="legacy-compact-p">保尔在烈士公墓前的一段独白成为全书最著名的段落：“人最宝贵的是生命，生命对人来说只有一次。人的一生应当这样度过：当他回首往事时，不会因为碌碌无为、虚度年华而悔恨，也不会因为为人卑劣、生活庸俗而愧疚。这样，在临死的时候，他就能够说：‘我已把自己整个的生命和全部的精力献给了世界上最壮丽的事业——为人类的解放而奋斗。’”</div>
                  </div>
                </div>

                {/* 三、人物形象分析 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">👥 三、人物形象分析</div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">保尔·柯察金 · 钢铁战士的化身</div>
                    <div className="legacy-compact-p">保尔是小说主人公，他的形象集中体现了无产阶级革命战士的崇高品质：顽强勇敢、意志坚定、对党忠诚、无私奉献。他具有强烈的反抗精神，从童年反抗神父，到青年时期投身革命，再到病重后拿起笔战斗，他的一生都在为理想而奋斗。保尔不是天生英雄，他在斗争中不断成长，身上既有英雄主义的光辉，也有普通人的软弱与挣扎，但每一次他都能战胜自我，实现精神升华。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">朱赫来 · 革命引路人</div>
                    <div className="legacy-compact-p">朱赫来是老布尔什维克，是保尔革命道路的引路人。他沉着冷静、经验丰富、善于引导青年。他教保尔拳击、讲革命道理，在保尔迷茫时给予指引，是保尔精神上的父亲。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">冬妮亚 · 初恋的幻灭</div>
                    <div className="legacy-compact-p">冬妮亚是林务官的女儿，保尔的初恋。她天真、善良，但带有资产阶级小姐的习气。保尔与她因阶级立场不同而分手，体现了保尔对革命信仰的坚守。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">丽达 · 革命的战友</div>
                    <div className="legacy-compact-p">丽达是共青团干部，与保尔志同道合。她干练、热情、有政治觉悟，是保尔理想的革命伴侣。但因误会两人未能走到一起，成为保尔一生的遗憾。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">达雅 · 生活的伴侣</div>
                    <div className="legacy-compact-p">达雅是保尔的妻子，在保尔病重后给予他无微不至的照顾。她淳朴、善良、坚韧，在保尔的帮助下成长为共产党员，是保尔晚年生活的精神支柱。</div>
                  </div>
                  
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">阿尔焦姆 · 亲情的力量</div>
                    <div className="legacy-compact-p">阿尔焦姆是保尔的哥哥，一个朴实的工人。他爱护弟弟，在保尔成长过程中给予物质和精神上的支持，代表了工人阶级的质朴与力量。</div>
                  </div>
                </div>
              </div>

              {/* ================= 背面（第2页） ================= */}
              <div className="legacy-page">
                {/* 四、主题思想 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">💡 四、主题思想</div>
                  <div className="legacy-highlight-box">
                    <div className="legacy-compact-p"><span className="legacy-strong">钢铁意志的赞歌</span>：小说通过保尔的成长历程，歌颂了无产阶级革命者钢铁般的意志。保尔在战争中负伤、在建设中牺牲健康、在病重后坚持创作，每一次困境都是对意志的淬炼，正如书名所喻：“钢铁是在烈火和急冷中炼成的。”</div>
                    <div className="legacy-compact-p"><span className="legacy-strong">生命价值的追问</span>：保尔关于“人最宝贵的是生命”的独白，引发了无数读者对生命意义的思考。小说回答了“人应该怎样活着”这一根本问题——为崇高理想而奋斗，生命才有价值。</div>
                    <div className="legacy-compact-p"><span className="legacy-strong">革命英雄主义</span>：小说展现了个人利益服从革命利益、个人命运融入时代洪流的英雄主义精神。保尔放弃爱情、牺牲健康，始终把党 and 人民的事业放在首位。</div>
                    <div className="legacy-compact-p"><span className="legacy-strong">理想主义的丰碑</span>：小说超越了个人命运，表达了对共产主义理想的坚定信念。保尔的奋斗历程证明：崇高的理想可以战胜一切困难。</div>
                  </div>
                </div>

                {/* 五、艺术特色 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">🎨 五、艺术特色</div>
                  <div className="legacy-subsection">
                    <div className="legacy-subsection-title">自传体小说的真实力量</div>
                    <div className="legacy-compact-p">小说以作者自身经历为蓝本，具有强烈的自传色彩。保尔的原型就是奥斯特洛夫斯基于本人，这种源于真实经历的创作使小说具有震撼人心的力量。书中许多情节，如保尔参加修路、双目失明后写作等，都是作者亲身经历的写照。</div>
                    
                    <div className="legacy-subsection-title">心理描写的深度</div>
                    <div className="legacy-compact-p">小说深入刻画了保尔的内心世界，展现了他的思想斗争和精神成长。特别是保尔在瘫痪后产生自杀念头的心理描写，真实展现了英雄人物内心的脆弱与挣扎，使人物形象更加立体丰满。</div>
                    
                    <div className="legacy-subsection-title">革命浪漫主义风格</div>
                    <div className="legacy-compact-p">小说将现实主义的真实描写与浪漫主义的理想抒发相结合，在严酷的斗争反应中展现出崇高的理想光辉。语言充满激情，富有感染力，激励了一代又一代读者。</div>
                    
                    <div className="legacy-subsection-title">跌宕起伏的叙事结构</div>
                    <div className="legacy-compact-p">小说以保尔的成长历程为主线，从童年到革命、从建设到病重、从绝望到新生，情节跌宕起伏，层层递进，有力地表现了“钢铁是怎样炼成的”这一主题。</div>
                  </div>
                </div>

                {/* 六、经典名言 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">📜 六、经典名言</div>
                  <div className="legacy-quote">
                    <p>“人最宝贵的是生命，生命对人来说只有一次。人的一生应当这样度过：当他回首往事时，不会因为碌碌无为、虚度年华而悔恨，也不会因为为人卑劣、生活庸俗而愧疚。这样，在临终的时候，他就能够说：‘我已把自己整个的生命和全部的精力献给了世界上最壮丽的事业——为人类的解放而奋斗。’”</p>
                    <p style={{ marginTop: '0.15rem' }}>—— 保尔·柯察金</p>
                  </div>
                  <div className="legacy-compact-p"><span className="legacy-strong">其他名句</span>：“钢是在烈火和急冷中炼成的，意志也是在苦难和斗争中磨炼出来的。”“任何一个傻瓜在任何时候都能结束自己！这是最怯弱也是最容易的出路。”</div>
                </div>

                {/* 七、中考考点归纳 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">📚 七、中考考点归纳</div>
                  <div className="legacy-highlight-box">
                    <ul className="list-disc ml-4 space-y-1">
                      <li className="legacy-compact-p"><strong>作者</strong>：奥斯特洛夫斯基（苏联），自传体小说。</li>
                      <li className="legacy-compact-p"><strong>主人公</strong>：保尔·柯察金，钢铁战士的象征。</li>
                      <li className="legacy-compact-p"><strong>核心事件</strong>：被学校开除→遇朱赫来→参加红军→头部受伤→参加筑路→全身瘫痪→双目失明→文学创作。</li>
                      <li className="legacy-compact-p"><strong>关键人物</strong>：朱赫来（革命引路人）、冬妮亚（初恋）、丽达（战友）、达雅（妻子）、阿尔焦姆（哥哥）。</li>
                      <li className="legacy-compact-p"><strong>经典名言</strong>：“人最宝贵的是生命……”（常考填空题/简答题）。</li>
                      <li className="legacy-compact-p"><strong>主题</strong>：歌颂钢铁意志、追问生命价值、弘扬革命英雄主义。</li>
                      <li className="legacy-compact-p"><strong>书名寓意</strong>：钢铁在烈火与急冷中炼成，比喻坚强的革命意志是在艰苦斗争中磨炼出来的。</li>
                      <li className="legacy-compact-p"><strong>艺术特色</strong>：自传体、心理描写、革命浪漫主义、语言激情澎湃。</li>
                    </ul>
                  </div>
                </div>

                {/* 八、深度思考 · 经典的意义 */}
                <div className="legacy-section">
                  <div className="legacy-section-title">💭 八、深度思考 · 经典的意义</div>
                  <div className="legacy-compact-p">《钢铁是怎样炼成的》不仅是一部文学名著，更是一部人生教科书。保尔·柯察金用他的一生诠释了什么是真正的英雄主义——在认清生活的真相后依然热爱生活，在遭受命运的打击后依然为理想奋斗。</div>
                  <div className="legacy-compact-p">今天，我们生活在和平年代，不再需要像保尔那样浴血奋战，但他那种永不放弃、为理想而奋斗的精神依然具有现实意义。面对学习中的困难、生活中的挫折，保尔的精神告诉我们：只要心中有信念，就没有克服不了的困难。</div>
                  <div className="legacy-compact-p">正如保尔所说：“钢是在烈火和急冷中炼成的。”每一个人的成长，都需要经历风雨的洗礼。愿我们都能在生活的熔炉中，炼就属于自己的“钢铁”。</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Fill in Blanks */}
          <section className="print-break-before">
            <h2 className="text-3xl font-bold border-b border-ink/20 pb-2 mb-6">贰 · 填空练习模块</h2>
            <div className="legacy-paper !shadow-none !p-0 !m-0">
              <div className="legacy-questions-list">
                {data.fillInBlanksQuestions?.map((q, idx) => (
                  <div key={idx} className="legacy-q-item">
                    {q.split('（ ）')[0]}<span className="legacy-blank">__________</span>{q.split('（ ）')[1]}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Choice Questions */}
          <section className="print-break-before">
            <h2 className="text-3xl font-bold border-b border-ink/20 pb-2 mb-6">叁 · 选择练习模块</h2>
            <div className="legacy-paper !shadow-none !p-0 !m-0">
              <div className="legacy-questions-list">
                {data.choiceQuestions.map((q, idx) => (
                  <div key={idx} className="legacy-q-item">
                    {q}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Short Answer */}
          <section className="print-break-before">
            <h2 className="text-3xl font-bold border-b border-ink/20 pb-2 mb-6">肆 · 主观探究与综合分析</h2>
            <div className="legacy-paper !shadow-none !p-0 !m-0">
              <div className="legacy-questions-container">
                {data.shortAnswerQuestions.map((q, idx) => (
                  <div key={idx} className="legacy-question-item">
                    <div className="legacy-q-title">{q}</div>
                    <div className="legacy-answer-lines">
                      <div className="legacy-line"></div>
                      <div className="legacy-line"></div>
                      {idx >= 20 && <div className="legacy-line"></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section: Answers */}
          <section className="print-break-before">
            <h2 className="text-3xl font-bold border-b border-ink/20 pb-2 mb-6">附件 · 参考答案大全</h2>
            <div className="legacy-paper !shadow-none !p-0 !m-0">
              <h1>《钢铁是怎样炼成的》参考答案</h1>
              <div className="legacy-subhead">选择题+填空题（横排）&nbsp;&nbsp;|&nbsp;&nbsp;简答题+分析题（竖排，自然接续）</div>

              <div className="legacy-section">
                <div className="legacy-ans-section-title">一、选择题答案 (共50题)</div>
                <div className="legacy-grid-answers">
                  {data.answers.choices.map((ans, idx) => (
                    <div key={idx} className="legacy-grid-item">
                      <span className="legacy-strong">{idx + 1}.</span> {ans}
                    </div>
                  ))}
                </div>
              </div>

              <div className="legacy-section">
                <div className="legacy-ans-section-title">二、填空题答案 (共50空)</div>
                <div className="legacy-grid-answers">
                  {data.answers.fillInBlanks.map((ans, idx) => (
                    <div key={idx} className="legacy-grid-item">
                      <span className="legacy-strong">{idx + 1}.</span> {ans}
                    </div>
                  ))}
                </div>
              </div>

              <div className="legacy-section">
                <div className="legacy-ans-section-title">三、简答与分析题详解</div>
                {data.shortAnswerDetailed.map((item, idx) => (
                  <div key={idx} className="legacy-vertical-answer">
                    <span className="answer-text">
                      {item.q}<br />
                      {item.a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="pt-12 text-center text-xs text-gray-400 border-t border-gray-100 no-print">
            © 2026 锦水微澜名师工作室 · 黄国荣老师版权所有 · 仅供校内教研使用
          </div>
        </div>
      </div>
    );
  }

  return null;
}
function ResourceCard({ id, icon, title, desc, color, action }: { id: string, icon: ReactNode, title: string, desc: string, color: string, action?: () => void }) {
  return (
    <div 
      onClick={action ? action : () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
      className={`gold-border p-4 md:p-8 border-l-[3px] md:border-l-[4px] ${color} bg-white/20 hover:bg-white/40 group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl no-print flex flex-col h-full`}
    >
      <div className="text-gold mb-3 md:mb-6 group-hover:text-cinnabar transition-colors scale-90 md:scale-125 origin-left">
        {icon}
      </div>
      <h3 className="text-base md:text-3xl font-bold mb-2 md:mb-4 leading-tight">{title}</h3>
      <p className="text-[10px] md:text-xl text-ink font-medium leading-relaxed md:leading-loose flex-1 mb-4 md:mb-0">{desc}</p>
      <div className="mt-auto flex items-center text-[10px] md:text-lg text-gold opacity-100 transition-all font-bold tracking-[0.05em] md:tracking-widest transform group-hover:translate-x-2">
        <span className="hidden xs:inline">查看详情</span> <ChevronRight className="w-3 h-3 md:w-5 md:h-5 ml-0.5 md:ml-2" />
      </div>
    </div>
  );
}
