import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Share2, ExternalLink, Calendar, Tag, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { AnimatedGrid } from '../components/AnimatedGrid';
import { SEO } from '../components/SEO';
import { useLanguage } from '../contexts/LanguageContext';
import { contentTranslations } from '../data/contentTranslations';
import { blogPosts, BlogPost } from '../data/blogPosts';

export type ContentSection = 'gnu-linux' | 'software-livre' | 'open-source';

const uiTranslations = {
  pt: {
    hero_title: 'Conteúdo & Blog',
    hero_subtitle: 'Aprenda os fundamentos e fique por dentro das novidades do mundo Open Source.',
    essential_title: 'Conteúdos Essenciais',
    blog_title: 'Últimos Posts do Blog',
    read_more: 'Ler conteúdo completo',
    back_button: 'Voltar para Conteúdos',
    quick_concept: 'Conceito Rápido',
    known_softwares: 'Softwares Livres Conhecidos',
    share: 'Compartilhar',
    last_update: 'Última atualização: Fevereiro de 2026',
    explore_others: 'Explorar outros conteúdos',
    posted_on: 'Postado em',
    by: 'por',
    tags: 'Tags'
  },
  en: {
    hero_title: 'Content & Blog',
    hero_subtitle: 'Learn the fundamentals and stay updated with the Open Source world.',
    essential_title: 'Essential Content',
    blog_title: 'Latest Blog Posts',
    read_more: 'Read full content',
    back_button: 'Back to Content',
    quick_concept: 'Quick Concept',
    known_softwares: 'Known Free Software',
    share: 'Share',
    last_update: 'Last update: February 2026',
    explore_others: 'Explore other content',
    posted_on: 'Posted on',
    by: 'by',
    tags: 'Tags'
  },
  es: {
    hero_title: 'Contenido & Blog',
    hero_subtitle: 'Aprende los fundamentos y mantente al día con el mundo Open Source.',
    essential_title: 'Contenidos Esenciales',
    blog_title: 'Últimos Posts del Blog',
    read_more: 'Leer conteúdo completo',
    back_button: 'Volver a Contenidos',
    quick_concept: 'Concepto Rápido',
    known_softwares: 'Softwares Libres Conocidos',
    share: 'Compartir',
    last_update: 'Última atualização: Febrero de 2026',
    explore_others: 'Explorar outros conteúdos',
    posted_on: 'Publicado el',
    by: 'por',
    tags: 'Etiquetas'
  }
};

export const Conteudo = () => {
  const [selectedEssentialId, setSelectedEssentialId] = useState<ContentSection | null>(null);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const { lang } = useLanguage();
  const t = uiTranslations[lang];
  const contentData = contentTranslations[lang];
  const posts = blogPosts[lang] || blogPosts['pt'];

  const handleBack = () => {
    setSelectedEssentialId(null);
    setSelectedBlogPost(null);
  };

  const isDetailView = selectedEssentialId || selectedBlogPost;

  return (
    <div className="min-h-screen pt-20 bg-light">
      <SEO 
        title={selectedEssentialId 
          ? contentData[selectedEssentialId].title 
          : selectedBlogPost 
            ? selectedBlogPost.title 
            : t.hero_title}
        description={selectedEssentialId 
          ? contentData[selectedEssentialId].subtitle 
          : selectedBlogPost 
            ? selectedBlogPost.metaDescription 
            : t.hero_subtitle}
        ogType={selectedBlogPost ? 'article' : 'website'}
        ogImage={selectedBlogPost?.image}
        canonical={selectedBlogPost ? `https://meulinux.com.br/conteudo/${selectedBlogPost.slug}` : 'https://meulinux.com.br/conteudo'}
      />
      <section className="bg-dark text-white py-16 relative overflow-hidden">
        <AnimatedGrid />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              {selectedEssentialId 
                ? contentData[selectedEssentialId].title 
                : selectedBlogPost 
                  ? selectedBlogPost.title 
                  : t.hero_title}
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              {selectedEssentialId 
                ? contentData[selectedEssentialId].subtitle 
                : selectedBlogPost 
                  ? selectedBlogPost.category 
                  : t.hero_subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12">
        <AnimatePresence mode="wait">
          {!isDetailView ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-20"
            >
              {/* Essential Content Section - Distinct Layout */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <h2 className="text-3xl font-display font-bold text-dark">{t.essential_title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {(Object.keys(contentData) as ContentSection[]).map((id) => (
                    <button
                      key={id}
                      onClick={() => setSelectedEssentialId(id)}
                      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all text-left flex flex-col border border-gray-100 h-full"
                    >
                      <div className="aspect-[16/9] relative overflow-hidden bg-gray-50">
                        <img
                          src={contentData[id].image}
                          alt={contentData[id].title}
                          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white font-bold text-sm flex items-center gap-2">
                            {t.read_more} <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-display font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                          {contentData[id].title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2">
                          {contentData[id].subtitle}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blog Posts Section */}
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <h2 className="text-3xl font-display font-bold text-dark">{t.blog_title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedBlogPost(post)}
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col h-full cursor-pointer group"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setSelectedBlogPost(post)}
                    >
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                            {post.category.split(' / ')[0]}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {post.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold text-dark mb-3 leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                          {post.metaDescription}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <span className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                            {t.read_more} <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-primary font-bold mb-8 transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t.back_button}
              </button>

              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {selectedBlogPost && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={selectedBlogPost.image} 
                      alt={selectedBlogPost.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                
                <div className="p-8 md:p-12">
                  {selectedEssentialId && (
                    <>
                      <div className="bg-primary/5 border-l-4 border-primary p-6 mb-12 rounded-r-xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">{t.quick_concept}</h3>
                        <p className="text-lg text-dark leading-relaxed italic">
                          {contentData[selectedEssentialId].concept}
                        </p>
                      </div>

                      <div className="space-y-16">
                        {contentData[selectedEssentialId].sections.map((section, idx) => (
                          <div key={idx} className="space-y-8">
                            {section.image && (
                              <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100">
                                <img
                                  src={section.image}
                                  alt={section.heading}
                                  className="w-full h-auto object-cover max-h-[400px]"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <div className="space-y-6">
                              <h2 className="text-3xl font-display font-bold text-dark border-b-2 border-primary/10 pb-4">
                                {section.heading}
                              </h2>
                              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                                {section.paragraphs.map((p, pIdx) => (
                                  <p key={pIdx}>{p}</p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        {selectedEssentialId === 'software-livre' && contentData['software-livre'].softwares && (
                          <div className="pt-12 border-t border-gray-100">
                            <h2 className="text-3xl font-display font-bold text-dark mb-8">{t.known_softwares}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                              {Object.entries(contentData['software-livre'].softwares).map(([category, list]) => (
                                <div key={category} className="bg-gray-50 p-6 rounded-xl">
                                  <h3 className="font-bold text-primary mb-4 uppercase tracking-wider text-sm">{category}</h3>
                                  <ul className="space-y-2">
                                    {list.map(software => (
                                      <li key={software.name}>
                                        <a 
                                          href={software.url} 
                                          target="_blank" 
                                          rel="noreferrer"
                                          className="flex items-center gap-3 text-dark font-medium hover:text-primary transition-colors group/link"
                                        >
                                          <div className="w-6 h-6 flex items-center justify-center bg-white rounded-sm p-0.5 shadow-sm border border-gray-100 group-hover/link:border-primary/30 transition-colors">
                                            <img 
                                              src={software.icon} 
                                              alt="" 
                                              className="max-w-full max-h-full object-contain"
                                              referrerPolicy="no-referrer"
                                            />
                                          </div>
                                          {software.name}
                                          <ExternalLink size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {selectedBlogPost && (
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
                        <span className="flex items-center gap-2">
                          <Calendar size={16} className="text-primary" /> {selectedBlogPost.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <Tag size={16} className="text-primary" /> {selectedBlogPost.category}
                        </span>
                      </div>
                      
                      <div>
                        <ReactMarkdown>{selectedBlogPost.content}</ReactMarkdown>
                      </div>

                      <div className="mt-12 pt-8 border-t border-gray-100">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{t.tags}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBlogPost.tags.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-dark px-4 py-2 rounded-xl font-bold transition-colors">
                        <Share2 size={18} /> {t.share}
                      </button>
                    </div>
                    <p className="text-sm text-gray-400 italic">
                      {t.last_update}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleBack}
                  className="bg-dark text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary transition-all shadow-lg"
                >
                  {t.explore_others}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
