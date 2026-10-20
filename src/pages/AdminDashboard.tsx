import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogOut, Settings, Plus, Edit2, Trash2, Tag, Calendar, Menu as MenuIcon, 
  X, Search, Users, Image as ImageIcon, ChevronRight, ChevronLeft, Save, Phone,
  Sparkles, Upload, RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { MenuItem, menuData as currentMenuData, mergeMenuWithSavedChanges } from '../data/menu';
import { Reservation } from '../data/reservations';
import { MenuCategory } from '../types';
import {
  getMenuItems,
  getSiteSettings,
  updateSiteSettings,
  SiteSettings,
  updateMenuItem,
  createMenuItem,
  getReservations,
  updateReservationStatus,
  deleteReservation,
  deleteMenuItem,
  uploadMenuItemImage,
  getMenuCategories,
  createMenuCategory,
  deleteMenuCategory,
} from '../lib/api';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isLoading, setIsLoading] = useState(true);
  
  // States
  const [activeUnit, setActiveUnit] = useState<'sao_paulo' | 'campos_jordao'>('sao_paulo');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [dbCategories, setDbCategories] = useState<MenuCategory[]>([]);
  const [reservationsData, setReservationsData] = useState<Record<string, Reservation[]>>({});
  
  // Menu Filters
  const categories = ['Todos', ...Array.from(new Set([
    ...menuItems.map(item => item.category),
    ...dbCategories.map(cat => cat.name)
  ]))].filter(Boolean);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [menuSearchTerm, setMenuSearchTerm] = useState('');
  const [resSearchTerm, setResSearchTerm] = useState('');

  // Modal States
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [promotingItem, setPromotingItem] = useState<MenuItem | null>(null);
  const [isSavingPromo, setIsSavingPromo] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageEditor, setImageEditor] = useState<{ file: File; previewUrl: string; target: 'edit' | 'new' } | null>(null);
  const [imageAdjust, setImageAdjust] = useState({ zoom: 1, x: 0, y: 0 });
  const [promoSaved, setPromoSaved] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newItem, setNewItem] = useState<Omit<MenuItem, 'id'>>({ 
    name: '', 
    category: '', 
    price: 0, 
    description: '', 
    image: '',
    isPromoted: false,
    promotionalPrice: 0,
    promotionLabel: ''
  });

  // Calendar States
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Maio 2026

  // Reservations State
  const [selectedResDay, setSelectedResDay] = useState<number | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  
  // Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [menuData, resData, settingsData, categoriesData] = await Promise.all([
          getMenuItems(activeUnit),
          getReservations(activeUnit),
          getSiteSettings(activeUnit),
          getMenuCategories(activeUnit)
        ]);
        setSiteSettings(settingsData);
        setDbCategories(categoriesData);
        
        // Filtra os itens locais padrão da unidade correspondente
        const localFiltered = currentMenuData.filter(item => {
          const itemUnit = item.unit || 'sao_paulo';
          return itemUnit === activeUnit;
        });
        setMenuItems(mergeMenuWithSavedChanges(localFiltered, menuData as MenuItem[]));

        // Formatar reservas (chave = "YYYY-MM-DD")
        const resRecord: Record<string, Reservation[]> = {};
        resData?.forEach(r => {
          const dateStr = r.reservation_date;
          if (!resRecord[dateStr]) resRecord[dateStr] = [];
          resRecord[dateStr].push(r as Reservation);
        });
        setReservationsData(resRecord);
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
        const localFiltered = currentMenuData.filter(item => {
          const itemUnit = item.unit || 'sao_paulo';
          return itemUnit === activeUnit;
        });
        setMenuItems(localFiltered);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [activeUnit, currentMonth, currentYear]);

  useEffect(() => {
    return () => {
      if (imageEditor?.previewUrl) URL.revokeObjectURL(imageEditor.previewUrl);
    };
  }, [imageEditor?.previewUrl]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
    setSelectedDay(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const created = await createMenuCategory(newCategoryName.trim(), activeUnit);
      setDbCategories([...dbCategories, created]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (err) {
      console.error("Erro ao criar categoria", err);
      alert("Erro ao criar categoria");
    }
  };

  const handleDeleteCategory = async (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${catName}"?`)) return;
    
    const dbCat = dbCategories.find(c => c.name === catName);
    if (dbCat) {
      try {
        await deleteMenuCategory(dbCat.id);
        setDbCategories(dbCategories.filter(c => c.id !== dbCat.id));
        if (activeCategory === catName) setActiveCategory('Todos');
      } catch (err) {
        console.error("Erro ao excluir categoria", err);
        alert("Erro ao excluir categoria");
      }
    } else {
      alert("Esta categoria não pode ser excluída pois está atrelada a produtos locais fixos.");
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateReservationStatus(id, status);
      // Reload reservations
      const resData = await getReservations(activeUnit);
      const resRecord: Record<string, Reservation[]> = {};
      resData?.forEach(r => {
        const dateStr = r.reservation_date;
        if (!resRecord[dateStr]) resRecord[dateStr] = [];
        resRecord[dateStr].push(r as Reservation);
      });
      setReservationsData(resRecord);
      
      // Update selected if needed
      if (selectedReservation?.id === id) {
        setSelectedReservation({ ...selectedReservation, status: status as any });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta reserva?")) return;
    try {
      await deleteReservation(id);
      // Reload reservations
      const resData = await getReservations(activeUnit);
      const resRecord: Record<string, Reservation[]> = {};
      resData?.forEach(r => {
        const dateStr = r.reservation_date;
        if (!resRecord[dateStr]) resRecord[dateStr] = [];
        resRecord[dateStr].push(r as Reservation);
      });
      setReservationsData(resRecord);
      setSelectedReservation(null);
    } catch (err) {
      console.error(err);
    }
  };

  const allReservations = useMemo(() => {
    return Object.values(reservationsData).flat();
  }, [reservationsData]);

  const filteredReservations = useMemo(() => {
    if (!resSearchTerm) return [];
    const term = resSearchTerm.toLowerCase();
    return allReservations.filter(res => 
      res.code?.toLowerCase().includes(term) ||
      res.titular1.toLowerCase().includes(term) ||
      res.email?.toLowerCase().includes(term) ||
      res.phone?.toLowerCase().includes(term)
    );
  }, [allReservations, resSearchTerm]);

  const tabs = [
    { id: 'menu', label: 'Cardápio', icon: <MenuIcon size={20} /> },
    { id: 'reservations', label: 'Reservas', icon: <Calendar size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  const filteredMenuItems = useMemo(() => {
    const normalizedSearch = menuSearchTerm.trim().toLowerCase();
    return menuItems.filter(item => {
      const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
      const matchesSearch = !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.description?.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, menuSearchTerm]);

  const promotedItemsCount = useMemo(() => {
    return menuItems.filter(item => item.isPromoted).length;
  }, [menuItems]);

  const menuCategoryCount = useMemo(() => {
    return Math.max(categories.length - 1, 0);
  }, [categories.length]);

  const saveMenuItem = async (item: MenuItem) => {
    const hasSupabaseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id);
    if (hasSupabaseId) {
      return updateMenuItem(item);
    }

    const { id, ...itemToCreate } = item;
    return createMenuItem(itemToCreate);
  };

  const isImageFile = (file: File) => {
    if (file.type.startsWith('image/')) return true;
    return /\.(avif|bmp|gif|heic|heif|jpeg|jpg|png|svg|tif|tiff|webp)$/i.test(file.name);
  };

  const createAdjustedMenuImage = (
    file: File,
    adjust = { zoom: 1, x: 0, y: 0 },
    outputSize = 900,
    quality = 0.78
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      image.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Nao foi possivel preparar a imagem.'));
          return;
        }

        canvas.width = outputSize;
        canvas.height = outputSize;
        context.fillStyle = '#140F22';
        context.fillRect(0, 0, outputSize, outputSize);

        const coverScale = Math.max(outputSize / image.width, outputSize / image.height);
        const scale = coverScale * adjust.zoom;
        const drawnWidth = image.width * scale;
        const drawnHeight = image.height * scale;
        const maxOffsetX = Math.max(0, (drawnWidth - outputSize) / 2);
        const maxOffsetY = Math.max(0, (drawnHeight - outputSize) / 2);
        const offsetX = (adjust.x / 100) * maxOffsetX;
        const offsetY = (adjust.y / 100) * maxOffsetY;
        const dx = (outputSize - drawnWidth) / 2 + offsetX;
        const dy = (outputSize - drawnHeight) / 2 + offsetY;

        context.drawImage(image, dx, dy, drawnWidth, drawnHeight);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Nao foi possivel comprimir a imagem.'));
              return;
            }

            const baseName = file.name
              .replace(/\.[^.]+$/, '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-zA-Z0-9]+/g, '-')
              .replace(/^-|-$/g, '')
              .toLowerCase() || 'produto';

            resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
          },
          'image/jpeg',
          quality
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Nao foi possivel abrir essa imagem no navegador. Tente JPG, PNG, WEBP, GIF, AVIF ou outra imagem comum.'));
      };

      image.src = objectUrl;
    });
  };

  const handleSaveEdit = async () => {
    if (imageEditor?.target === 'edit') {
      alert('Finalize o enquadramento da imagem antes de salvar o produto.');
      return;
    }

    if (isUploadingImage) {
      alert('A imagem ainda esta sendo enviada. Aguarde terminar para salvar.');
      return;
    }

    if (editingItem) {
      try {
        const savedItem = await saveMenuItem(editingItem);
        setMenuItems(prev => prev.map(item => item.id === editingItem.id ? savedItem : item));
        setEditingItem(null);
      } catch (err) {
        console.error("Erro ao salvar", err);
        const message = err instanceof Error ? err.message : 'Erro desconhecido';
        alert(`Nao foi possivel salvar no Supabase: ${message}`);
      }
    }
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    const hasSupabaseId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id);

    if (!confirm(`Tem certeza que deseja apagar "${item.name}" do cardápio?`)) return;

    try {
      if (hasSupabaseId) {
        await deleteMenuItem(item.id);
      }
      setMenuItems(prev => prev.filter(menuItem => menuItem.id !== item.id));
    } catch (err) {
      console.error("Erro ao apagar item", err);
      alert('Erro ao apagar item no Supabase. Tente novamente.');
    }
  };

  const updateItemImageFromFile = (file: File, target: 'edit' | 'new') => {
    if (!isImageFile(file)) {
      alert('Escolha um arquivo de imagem valido.');
      return;
    }

    setImageAdjust({ zoom: 1, x: 0, y: 0 });
    setImageEditor(prev => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return {
        file,
        target,
        previewUrl: URL.createObjectURL(file),
      };
    });
  };

  const closeImageEditor = () => {
    setImageEditor(prev => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const handleApplyAdjustedImage = async () => {
    if (!imageEditor) return;

    setIsUploadingImage(true);

    try {
      const adjustedFile = await createAdjustedMenuImage(imageEditor.file, imageAdjust, 900, 0.78);
      let finalImage = '';

      try {
        finalImage = await uploadMenuItemImage(adjustedFile);
      } catch (uploadError) {
        console.warn('Storage indisponivel; usando imagem comprimida no banco:', uploadError);
        const fallbackFile = await createAdjustedMenuImage(imageEditor.file, imageAdjust, 420, 0.62);
        finalImage = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(new Error('Nao foi possivel preparar a imagem para salvar.'));
          reader.readAsDataURL(fallbackFile);
        });
      }

      if (imageEditor.target === 'edit') {
        setEditingItem(prev => prev ? { ...prev, image: finalImage } : prev);
      }
      if (imageEditor.target === 'new') {
        setNewItem(prev => ({ ...prev, image: finalImage }));
      }
      closeImageEditor();
    } catch (err) {
      console.error('Upload para Storage falhou:', err);
      alert(err instanceof Error ? err.message : 'Nao foi possivel preparar a imagem. Tente outra foto.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSavePromo = async () => {
    if (!promotingItem) return;
    setIsSavingPromo(true);
    try {
      const savedItem = await saveMenuItem(promotingItem);
      // Update local state so it reflects immediately in the admin list
      setMenuItems(prev => prev.map(item => item.id === promotingItem.id ? savedItem : item));
      setPromotingItem(null);
      // Show success toast
      setPromoSaved(true);
      setTimeout(() => setPromoSaved(false), 3000);
    } catch (err) {
      console.error("Erro ao salvar promoção:", err);
      alert('Erro ao salvar. Verifique sua conexão com o Supabase.');
    } finally {
      setIsSavingPromo(false);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createMenuItem({ ...newItem, unit: activeUnit });
      setMenuItems(prev => [created, ...prev]);
      setAddingItem(false);
      setNewItem({ 
        name: '', 
        category: '', 
        price: 0, 
        description: '', 
        image: '',
        isPromoted: false,
        promotionalPrice: 0,
        promotionLabel: ''
      });
    } catch (err) {
      console.error("Erro ao criar item", err);
      alert('Erro ao salvar o prato. Verifique se preencheu todos os campos corretamente e tente novamente.');
    }
  };


  return (
    <div className="admin-page h-screen bg-dark flex text-platinum font-sans selection:bg-gold/30 overflow-hidden">
      
      {/* Success Toast */}
      <AnimatePresence>
        {promoSaved && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Promoção salva! Já disponível na seção de promoções do site.
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed md:sticky md:top-0 inset-y-0 left-0 w-72 h-screen bg-darker border-r border-gold/10 z-50 flex flex-col shadow-2xl md:shadow-none"
          >
            <div className="p-8 border-b border-gold/10 flex justify-between items-center bg-dark">
              <div>
                <h2 className="text-xl font-serif font-bold text-gold tracking-tighter">ADMIN</h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-platinum/40">Bistrot de Ville</p>
              </div>
              <button 
                className="md:hidden text-platinum/50 hover:text-gold transition-colors p-2 bg-white/5 rounded-lg"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
              <div className="text-[10px] uppercase tracking-[0.2em] text-platinum/30 font-bold mb-4 ml-2">Menu Principal</div>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (window.innerWidth <= 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all text-sm font-medium ${
                    activeTab === tab.id 
                      ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
                      : 'text-platinum/60 hover:bg-white/5 hover:text-platinum'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-6 border-t border-gold/10 bg-dark">
              <div className="mb-4 rounded-2xl border border-gold/10 bg-white/5 p-4">
                <p className="text-[9px] uppercase tracking-[0.24em] text-platinum/35 font-bold">Status</p>
                <p className="mt-2 text-sm text-gold font-bold">{menuItems.length} itens no cardápio</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-xl transition-all text-sm font-bold uppercase tracking-wider"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-dark">
        {/* Topbar */}
        <header className="h-20 bg-dark/80 backdrop-blur-xl border-b border-gold/10 flex items-center justify-between px-6 md:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-platinum/60 hover:text-gold p-2.5 rounded-xl bg-white/5 hover:bg-gold/10 border border-transparent hover:border-gold/20 transition-all hidden md:block"
              >
                <MenuIcon size={20} />
              </button>
            )}
            <div>
              <h1 className="text-2xl font-serif font-bold text-platinum tracking-tight">{tabs.find(t => t.id === activeTab)?.label}</h1>
            </div>
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-gold/15">
            <button
              onClick={() => {
                setActiveUnit('sao_paulo');
                setSelectedDay(null);
                setSelectedResDay(null);
                setSelectedReservation(null);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                activeUnit === 'sao_paulo'
                  ? 'bg-gold text-dark shadow-lg shadow-gold/25'
                  : 'text-platinum/50 hover:text-platinum hover:bg-white/5'
              }`}
            >
              São Paulo
            </button>
            <button
              onClick={() => {
                setActiveUnit('campos_jordao');
                setSelectedDay(null);
                setSelectedResDay(null);
                setSelectedReservation(null);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${
                activeUnit === 'campos_jordao'
                  ? 'bg-gold text-dark shadow-lg shadow-gold/25'
                  : 'text-platinum/50 hover:text-platinum hover:bg-white/5'
              }`}
            >
              Campos do Jordão
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-gold text-dark flex items-center justify-center font-serif font-bold text-lg shadow-lg shadow-gold/20">
              A
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-scroll-area flex-1 overflow-y-auto p-6 pb-28 md:p-10 md:pb-10 scroll-smooth">
          
          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
                <div className="bg-darker p-8 rounded-3xl border border-gold/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gold/15 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-gold">
                      <Sparkles size={12} /> Painel de operação
                    </div>
                    <h3 className="mt-5 text-3xl md:text-4xl font-serif font-bold text-gold">Gerenciar Cardápio</h3>
                    <p className="text-sm text-platinum/55 mt-3 leading-relaxed">Busque pratos, filtre categorias, atualize preços e troque imagens com prévia antes de salvar.</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 xl:grid-cols-1 gap-3">
                  <div className="rounded-3xl border border-gold/10 bg-darker p-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-platinum/35 font-bold">Produtos</p>
                    <p className="mt-2 text-3xl font-serif font-bold text-gold">{menuItems.length}</p>
                  </div>
                  <div className="rounded-3xl border border-gold/10 bg-darker p-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-platinum/35 font-bold">Categorias</p>
                    <p className="mt-2 text-3xl font-serif font-bold text-gold">{menuCategoryCount}</p>
                  </div>
                  <div className="rounded-3xl border border-gold/10 bg-darker p-5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-platinum/35 font-bold">Promoções</p>
                    <p className="mt-2 text-3xl font-serif font-bold text-gold">{promotedItemsCount}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gold/10 bg-darker p-4 md:p-5 flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input
                    type="text"
                    value={menuSearchTerm}
                    onChange={(e) => setMenuSearchTerm(e.target.value)}
                    placeholder="Buscar prato, categoria ou ingrediente..."
                    className="w-full bg-dark border border-gold/15 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setIsAddingCategory(true)}
                    className="px-6 py-4 bg-darker text-platinum border border-gold/20 hover:border-gold hover:text-gold transition-all rounded-2xl flex items-center justify-center gap-2 shrink-0 font-bold uppercase tracking-[0.1em] text-[11px]"
                  >
                    <Plus size={16} /> Nova Categoria
                  </button>
                  <button 
                    onClick={() => setAddingItem(true)}
                    className="px-6 py-4 bg-gold text-dark font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-white transition-all rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center justify-center gap-2 shrink-0"
                  >
                    <Plus size={16} /> Adicionar Produto
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="admin-category-scroll flex gap-2 overflow-x-scroll pb-4">
                {categories.map(cat => {
                  const isDbCategory = dbCategories.some(c => c.name === cat);
                  return (
                    <div 
                      key={cat}
                      className={`flex items-center shrink-0 whitespace-nowrap text-[10px] uppercase tracking-[0.15em] font-bold transition-all rounded-full border overflow-hidden ${
                        activeCategory === cat 
                          ? 'bg-gold text-dark border-gold shadow-lg shadow-gold/20' 
                          : 'border-white/10 text-platinum/50 hover:bg-white/5 hover:text-platinum'
                      }`}
                    >
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 outline-none ${cat !== 'Todos' && isDbCategory ? 'pr-2' : ''}`}
                      >
                        {cat}
                      </button>
                      
                      {cat !== 'Todos' && isDbCategory && (
                        <button 
                          onClick={(e) => handleDeleteCategory(cat, e)}
                          className={`pr-4 pl-2 py-2.5 opacity-50 hover:opacity-100 transition-opacity ${
                            activeCategory === cat ? 'hover:text-red-700' : 'hover:text-red-400'
                          }`}
                          title="Excluir Categoria"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMenuItems.map(item => (
                  <div key={item.id} className="bg-darker border border-gold/10 rounded-[24px] p-4 flex gap-4 group hover:border-gold/30 transition-all">
                    <div className="w-24 h-24 rounded-[16px] overflow-hidden shrink-0 relative border border-gold/20">
                      <img 
                        src={item.image || `https://picsum.photos/seed/${item.name}/200/200`} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <button
                        onClick={() => setEditingItem(item)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white transition-opacity backdrop-blur-sm"
                      >
                        <ImageIcon size={20} />
                        <span className="text-[8px] uppercase tracking-widest font-bold">Trocar foto</span>
                      </button>
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] uppercase tracking-widest text-gold">{item.category}</span>
                          <button 
                            onClick={() => setPromotingItem(item)}
                            className={`md:hidden ${item.isPromoted ? 'text-gold' : 'text-platinum/40 hover:text-gold'}`} 
                          >
                            <Tag size={12} />
                          </button>
                        </div>
                        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => setPromotingItem(item)}
                            className={`${item.isPromoted ? 'text-gold' : 'text-platinum/40 hover:text-gold'}`} 
                            title="Promover"
                          >
                            <Tag size={14} />
                          </button>
                          <button 
                            onClick={() => setEditingItem(item)}
                            className="text-platinum/40 hover:text-gold" 
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item)}
                            className="text-platinum/40 hover:text-red-400"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-serif font-bold text-lg text-platinum leading-tight mb-1">{item.name}</h4>
                      <p className="text-[9px] text-platinum/40 line-clamp-1 mb-2">{item.description}</p>
                      <div className="mt-auto flex flex-col items-start justify-end">
                        {item.isPromoted && item.promotionalPrice && (
                           <span className="text-platinum/40 text-[9px] line-through mb-0.5">
                             {typeof item.price === 'number' ? `R$ ${item.price.toFixed(2)}` : 'Variado'}
                           </span>
                        )}
                        <span className="text-gold font-bold">
                          {item.isPromoted && item.promotionalPrice 
                            ? (typeof item.promotionalPrice === 'number' ? `R$ ${item.promotionalPrice.toFixed(2)}` : 'Variado') 
                            : (typeof item.price === 'number' ? `R$ ${item.price.toFixed(2)}` : 'Variado')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredMenuItems.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gold/15 bg-darker p-12 text-center">
                  <Search size={36} className="mx-auto text-platinum/20 mb-4" />
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-platinum/45">Nenhum item encontrado</p>
                </div>
              )}
            </div>
          )}

          {/* RESERVATIONS TAB */}
          {activeTab === 'reservations' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-darker p-8 rounded-3xl border border-gold/10">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-gold">Controle de Reservas</h3>
                  <p className="text-sm text-platinum/50 mt-2">Acompanhe mesas, horários e solicitações de reserva por data.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" size={18} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar código, nome..."
                    className="w-full bg-dark border border-gold/20 rounded-xl py-3 pl-12 pr-4 text-xs focus:border-gold outline-none transition-all"
                    value={resSearchTerm}
                    onChange={(e) => setResSearchTerm(e.target.value)}
                  />
                  {resSearchTerm && (
                    <button onClick={() => setResSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-platinum/40 hover:text-white">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* CALENDAR COMPONENT FOR RESERVATIONS */}
                <div className="w-full lg:w-[450px] bg-darker/60 backdrop-blur-xl border border-gold/10 rounded-[40px] p-8 shrink-0">
                  <div className="flex justify-between items-center mb-8">
                    <button onClick={() => changeMonth(-1)} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:text-gold hover:border-gold/30 transition-all">
                      <ChevronLeft size={18}/>
                    </button>
                    <div className="text-center">
                      <h3 className="text-gold font-serif font-bold text-xl uppercase tracking-widest">{monthNames[currentMonth]}</h3>
                      <p className="text-[10px] text-platinum/30 tracking-[0.3em] font-bold">{currentYear}</p>
                    </div>
                    <button onClick={() => changeMonth(1)} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:text-gold hover:border-gold/30 transition-all">
                      <ChevronRight size={18}/>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-3 mb-6 text-center">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                      <div key={day} className="text-[10px] uppercase tracking-widest text-platinum/20 font-bold">{day}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({length: firstDayOfMonth}).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square opacity-0"></div>
                    ))}
                    {Array.from({length: daysInMonth}, (_, i) => i + 1).map(day => {
                      const dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                      const hasReservations = reservationsData[dateKey] && reservationsData[dateKey].length > 0;
                      const isSelected = selectedResDay === day;

                      return (
                        <button 
                          key={day}
                          onClick={() => {
                            setSelectedResDay(day);
                            setSelectedReservation(null);
                          }}
                          className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-bold transition-all duration-300 ${
                            isSelected 
                              ? 'bg-gold text-dark shadow-[0_10px_20px_rgba(212,175,55,0.4)] scale-110 z-10' 
                              : hasReservations 
                                ? 'bg-gold/10 text-gold hover:bg-gold/20 border border-gold/20'
                                : 'text-platinum/40 hover:bg-white/5 border border-transparent'
                          }`}
                        >
                          {day}
                          {hasReservations && !isSelected && (
                            <span className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-gold"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* RESERVATIONS LIST & DETAILS */}
                <div className="flex-1 w-full flex flex-col gap-6">
                  {selectedReservation ? (
                    /* DETALHES DA RESERVA SELECIONADA */
                    <div className="bg-darker border border-gold/20 rounded-[32px] overflow-hidden flex flex-col relative">
                      <div className="p-8 border-b border-gold/10 flex justify-between items-start bg-dark/50">
                        <div>
                          <button onClick={() => setSelectedReservation(null)} className="text-[10px] uppercase tracking-widest text-gold hover:underline flex items-center gap-1 mb-4">
                            <ChevronLeft size={12}/> Voltar para lista
                          </button>
                          <h4 className="text-3xl font-serif font-bold text-white mb-2">{selectedReservation.type}</h4>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-platinum/40 font-bold">
                            {new Date(selectedReservation.reservation_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} • {selectedReservation.time}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            selectedReservation.status === 'Confirmado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {selectedReservation.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Titular Principal</p>
                          <p className="text-lg font-bold text-platinum flex items-center gap-2"><Users size={16} className="text-gold"/> {selectedReservation.titular1}</p>
                        </div>
                        {selectedReservation.titular2 && (
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Segundo Titular / Acompanhante</p>
                            <p className="text-lg font-bold text-platinum flex items-center gap-2"><Users size={16} className="text-gold"/> {selectedReservation.titular2}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Total de Pessoas</p>
                          <p className="text-2xl font-serif font-bold text-gold">{selectedReservation.people} Convidados</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Horário de Chegada</p>
                          <p className="text-2xl font-serif font-bold text-platinum">{selectedReservation.time}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Telefone</p>
                          <div className="flex items-center gap-3">
                            <p className="text-lg font-bold text-platinum">{selectedReservation.phone || 'Não informado'}</p>
                            {selectedReservation.phone && (
                              <a 
                                href={`https://wa.me/${selectedReservation.phone.replace(/\D/g, '')}?text=Olá ${selectedReservation.titular1}, aqui é do Bistrot de Ville. Gostaria de confirmar sua reserva ${selectedReservation.code} para o dia ${new Date(selectedReservation.reservation_date).toLocaleDateString('pt-BR')}.`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500 hover:text-dark transition-all"
                              >
                                <Phone size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">E-mail</p>
                          <p className="text-lg font-bold text-platinum">{selectedReservation.email || 'Não informado'}</p>
                        </div>
                        {selectedReservation.code && (
                          <div>
                            <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-1">Código da Reserva</p>
                            <p className="text-lg font-bold text-gold">{selectedReservation.code}</p>
                          </div>
                        )}
                        <div className="col-span-2 flex gap-4 pt-6 border-t border-white/5">
                          <button 
                            onClick={() => handleStatusUpdate(selectedReservation.id!, 'Confirmado')}
                            className="flex-1 py-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-green-500 hover:text-dark transition-all"
                          >
                            Confirmar
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(selectedReservation.id!, 'Aguardando')}
                            className="flex-1 py-3 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-yellow-500 hover:text-dark transition-all"
                          >
                            Em Espera
                          </button>
                          <button 
                            onClick={() => handleDeleteReservation(selectedReservation.id!)}
                            className="px-6 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : resSearchTerm ? (
                    /* RESULTADOS DA PESQUISA */
                    <div className="bg-darker border border-gold/10 rounded-3xl p-8">
                      <div className="flex justify-between items-center mb-8">
                        <h4 className="text-xl font-serif font-bold text-platinum">Resultados para "{resSearchTerm}"</h4>
                        <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {filteredReservations.length} encontrados
                        </span>
                      </div>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar">
                        {filteredReservations.map(res => (
                          <button 
                            key={res.id}
                            onClick={() => setSelectedReservation(res)}
                            className="w-full text-left bg-dark border border-white/5 p-6 rounded-2xl hover:border-gold/30 hover:bg-white/5 transition-all group flex flex-col md:flex-row justify-between md:items-center gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-gold/60">{res.code || '#----'}</div>
                              <div>
                                <h5 className="font-serif font-bold text-lg text-platinum group-hover:text-gold transition-colors">{res.type}</h5>
                                <p className="text-sm text-platinum/60 mt-1">{res.titular1} • {new Date(res.reservation_date).toLocaleDateString('pt-BR')}</p>
                              </div>
                            </div>
                            <div className="flex gap-4 items-center">
                              <div className="text-center px-4 border-r border-white/10">
                                <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-0.5">Pessoas</p>
                                <p className="font-bold text-platinum">{res.people}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                res.status === 'Confirmado' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                              }`}>
                                {res.status}
                              </span>
                            </div>
                          </button>
                        ))}
                        {filteredReservations.length === 0 && (
                          <div className="text-center py-12">
                            <Search size={48} className="text-platinum/10 mx-auto mb-4" />
                            <p className="text-platinum/40 uppercase tracking-widest text-xs">Nenhuma reserva encontrada</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : selectedResDay ? (
                    (() => {
                      const dateKey = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${selectedResDay.toString().padStart(2, '0')}`;
                      const dayReservations = reservationsData[dateKey];
                      return dayReservations && dayReservations.length > 0 ? (
                        /* LISTA DE RESERVAS DO DIA */
                        <div className="bg-darker border border-gold/10 rounded-3xl p-8">
                          <div className="flex justify-between items-center mb-8">
                            <h4 className="text-xl font-serif font-bold text-platinum">Reservas para o dia {selectedResDay}/{currentMonth + 1}</h4>
                            <span className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest">
                              {dayReservations.length} reservas
                            </span>
                          </div>

                          <div className="space-y-4">
                            {dayReservations.map(res => (
                              <button 
                                key={res.id}
                                onClick={() => setSelectedReservation(res)}
                                className="w-full text-left bg-dark border border-white/5 p-6 rounded-2xl hover:border-gold/30 hover:bg-white/5 transition-all group flex flex-col md:flex-row justify-between md:items-center gap-4"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="px-3 py-1 bg-white/5 rounded text-[10px] font-mono text-gold/60">{res.code || '#----'}</div>
                                  <div>
                                    <h5 className="font-serif font-bold text-lg text-platinum group-hover:text-gold transition-colors">{res.type}</h5>
                                    <p className="text-sm text-platinum/60 mt-1">{res.titular1} {res.titular2 ? `& ${res.titular2}` : ''}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                  <div className="text-center px-4 border-r border-white/10">
                                    <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-0.5">Pessoas</p>
                                    <p className="font-bold text-platinum">{res.people}</p>
                                  </div>
                                  <div className="text-center px-4 border-r border-white/10">
                                    <p className="text-[9px] uppercase tracking-widest text-platinum/40 mb-0.5">Horário</p>
                                    <p className="font-bold text-platinum">{res.time}</p>
                                  </div>
                                  <div className="pl-2">
                                    <span className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                      res.status === 'Confirmado' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'
                                    }`}>
                                      {res.status}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-darker border border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full">
                          <Calendar className="text-platinum/20 mb-6" size={48} />
                          <h4 className="text-xl font-serif font-bold text-white mb-2">Nenhuma reserva no dia {selectedResDay}</h4>
                          <p className="text-sm text-platinum/40 max-w-sm mb-8">O salão está completamente livre nesta data.</p>
                        </div>
                      );
                    })()) : (
                    <div className="bg-darker border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full opacity-50">
                      <p className="text-sm font-bold uppercase tracking-[0.3em] text-platinum/40">Selecione uma data no calendário</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center border-2 border-dashed border-gold/10 rounded-3xl bg-darker/50 p-6 animate-in fade-in zoom-in-95 duration-500">
              <Settings size={32} className="text-gold/50 mb-4" />
              <h3 className="text-2xl font-serif font-bold text-platinum/80 mb-3">Configurações Gerais</h3>
              <p className="text-sm text-platinum/40 max-w-md leading-relaxed">
                Em breve você poderá alterar informações globais do restaurante aqui.
              </p>
            </div>
          )}

        </div>
      </main>

      {/* MODAL DE ENQUADRAMENTO DE IMAGEM */}
      <AnimatePresence>
        {imageEditor && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
              onClick={closeImageEditor}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-dark border border-gold/20 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-gold/10 bg-darker flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gold">Ajustar Imagem</h3>
                  <p className="text-[10px] uppercase tracking-widest text-platinum/40">Enquadre como foto de perfil</p>
                </div>
                <button onClick={closeImageEditor} className="text-platinum/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="mx-auto w-full max-w-[320px] aspect-square overflow-hidden rounded-[28px] border border-gold/20 bg-darker relative">
                  <img
                    src={imageEditor.previewUrl}
                    alt="Prévia do enquadramento"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{
                      transform: `translate(${imageAdjust.x * 0.28}%, ${imageAdjust.y * 0.28}%) scale(${imageAdjust.zoom})`,
                      transformOrigin: 'center',
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none border-[10px] border-black/10 rounded-[28px]" />
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-platinum/45 font-bold mb-2">
                      <span>Zoom</span>
                      <span>{Math.round(imageAdjust.zoom * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="2.4"
                      step="0.01"
                      value={imageAdjust.zoom}
                      onChange={(e) => setImageAdjust(prev => ({ ...prev, zoom: Number(e.target.value) }))}
                      className="w-full accent-[#BDE9C4]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-platinum/45 font-bold mb-2">
                      <span>Horizontal</span>
                      <span>{imageAdjust.x}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={imageAdjust.x}
                      onChange={(e) => setImageAdjust(prev => ({ ...prev, x: Number(e.target.value) }))}
                      className="w-full accent-[#BDE9C4]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-platinum/45 font-bold mb-2">
                      <span>Vertical</span>
                      <span>{imageAdjust.y}</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      step="1"
                      value={imageAdjust.y}
                      onChange={(e) => setImageAdjust(prev => ({ ...prev, y: Number(e.target.value) }))}
                      className="w-full accent-[#BDE9C4]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gold/10 bg-darker flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setImageAdjust({ zoom: 1, x: 0, y: 0 })}
                  className="px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-platinum hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} /> Centralizar
                </button>
                <button
                  type="button"
                  onClick={closeImageEditor}
                  disabled={isUploadingImage}
                  className="px-5 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-platinum hover:bg-white/5 transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyAdjustedImage}
                  disabled={isUploadingImage}
                  className="px-7 py-3 bg-gold text-dark rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Upload size={15} /> {isUploadingImage ? 'Enviando...' : 'Usar Imagem'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE EDIÇÃO DE CARDÁPIO */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditingItem(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-dark border border-gold/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-darker">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gold">Editar Produto</h3>
                  <p className="text-[10px] uppercase tracking-widest text-platinum/40">Atualize informações e preços</p>
                </div>
                <button onClick={() => setEditingItem(null)} className="text-platinum/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 bg-dark space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-6 items-start">
                  <div className="space-y-3">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden relative border border-gold/20 shrink-0 bg-darker">
                      <img src={editingItem.image || `https://picsum.photos/seed/${editingItem.name}/300/300`} alt={editingItem.name} className="w-full h-full object-cover"/>
                    </div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gold/20 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-dark transition-all">
                      <Upload size={14} />
                      {isUploadingImage ? 'Enviando...' : 'Escolher foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isUploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateItemImageFromFile(file, 'edit');
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Nome do Produto</label>
                      <input 
                        type="text" 
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                        className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Categoria</label>
                      <input 
                        type="text" 
                        list="categories-list"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Imagem do Cardápio</label>
                      <input 
                        type="text" 
                        value={editingItem.image || ''}
                        onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                        className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-white"
                        placeholder="Cole uma URL de imagem ou escolha um arquivo ao lado"
                      />
                      <p className="mt-2 text-[10px] text-platinum/35 leading-relaxed">Use uma URL pública ou selecione uma foto do computador. A prévia muda na hora e salva junto com o produto.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Ingredientes / Descrição</label>
                  <textarea 
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none transition-all text-sm h-24 resize-none rounded-xl text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 block">Preços / Variações</label>
                    <button className="text-[10px] text-gold uppercase tracking-widest font-bold hover:underline flex items-center gap-1">
                      <Plus size={12}/> Add Variação
                    </button>
                  </div>
                  
                  {typeof editingItem.price === 'number' ? (
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <input type="text" value="Preço Único" disabled className="w-full bg-darker/50 border border-white/5 p-4 text-sm rounded-xl text-platinum/40" />
                      </div>
                      <div className="relative w-40">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/40 text-sm">R$</span>
                        <input 
                          type="number" 
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value)})}
                          className="w-full bg-darker border border-white/10 p-4 pl-10 focus:border-gold outline-none transition-all text-sm rounded-xl text-white font-bold"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(editingItem.price).map(([key, val]) => (
                        <div key={key} className="flex gap-4 items-center">
                          <div className="flex-1">
                            <input type="text" value={key} className="w-full bg-darker border border-white/10 p-4 text-sm rounded-xl text-white" 
                               onChange={(e) => {
                                 const newPrice = {...(editingItem.price as object)};
                                 const newVal = (newPrice as any)[key];
                                 delete (newPrice as any)[key];
                                 (newPrice as any)[e.target.value] = newVal;
                                 setEditingItem({...editingItem, price: newPrice as any});
                               }}
                            />
                          </div>
                          <div className="relative w-40">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/40 text-sm">R$</span>
                            <input 
                              type="number" 
                              value={val}
                              onChange={(e) => {
                                 const newPrice = {...(editingItem.price as object), [key]: parseFloat(e.target.value)};
                                 setEditingItem({...editingItem, price: newPrice as any});
                              }}
                              className="w-full bg-darker border border-white/10 p-4 pl-10 focus:border-gold outline-none transition-all text-sm rounded-xl text-white font-bold"
                            />
                          </div>
                          <button className="p-3 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all">
                            <Trash2 size={16}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gold/10 bg-darker flex justify-end gap-4">
                <button onClick={() => setEditingItem(null)} className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-platinum hover:bg-white/5 transition-all">Cancelar</button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isUploadingImage}
                  className="px-8 py-3 bg-gold text-dark rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save size={16}/> {isUploadingImage ? 'Enviando imagem...' : 'Salvar'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE PROMOÇÃO */}
      <AnimatePresence>
        {promotingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPromotingItem(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-dark border border-gold/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 text-center border-b border-gold/10 bg-darker relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 blur-[40px] rounded-full pointer-events-none" />
                <Tag className="mx-auto text-gold mb-4 relative z-10" size={32} />
                <h3 className="text-2xl font-serif font-bold text-white relative z-10">Adicionar Promoção</h3>
                <p className="text-[10px] uppercase tracking-widest text-platinum/50 mt-2 relative z-10">
                  O item irá para a seção "Seleção Especial" na Home.
                </p>
              </div>

              <div className="p-8 bg-dark space-y-6">
                <div className="bg-darker border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                  <img src={promotingItem.image} className="w-16 h-16 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="font-serif font-bold text-lg text-platinum">{promotingItem.name}</h4>
                    <p className="text-[10px] text-platinum/50 uppercase tracking-widest">
                      Preço Atual: {typeof promotingItem.price === 'number' ? `R$ ${promotingItem.price.toFixed(2)}` : 'Variado'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block flex justify-between">
                    <span>Ativar Promoção?</span>
                  </label>
                  <label className="flex items-center cursor-pointer mb-6">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={promotingItem.isPromoted || false}
                        onChange={(e) => setPromotingItem({...promotingItem, isPromoted: e.target.checked})}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${promotingItem.isPromoted ? 'bg-gold' : 'bg-darker border border-white/10'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${promotingItem.isPromoted ? 'transform translate-x-6 bg-dark' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-bold text-platinum/80">
                      {promotingItem.isPromoted ? 'Ativada (Visível na Home)' : 'Desativada'}
                    </div>
                  </label>

                  {promotingItem.isPromoted && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Nome da Promoção <span className="text-platinum/30">(opcional)</span></label>
                        <input 
                          type="text"
                          value={promotingItem.promotionLabel || ''}
                          onChange={(e) => setPromotingItem({...promotingItem, promotionLabel: e.target.value})}
                          className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none transition-all text-sm rounded-xl text-white"
                          placeholder="Ex: Happy Hour, Especial de Verão..."
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Preço Promocional</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-platinum/40 text-sm font-bold">R$</span>
                          <input 
                            type="number" 
                            value={promotingItem.promotionalPrice as number || ''}
                            onChange={(e) => setPromotingItem({...promotingItem, promotionalPrice: parseFloat(e.target.value)})}
                            className="w-full bg-darker border border-gold/30 p-4 pl-12 focus:border-gold outline-none transition-all text-lg rounded-xl text-gold font-bold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            placeholder="Ex: 19.90"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gold/10 bg-darker flex justify-end gap-4">
                <button 
                  onClick={() => setPromotingItem(null)} 
                  disabled={isSavingPromo}
                  className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-platinum hover:bg-white/5 transition-all disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSavePromo} 
                  disabled={isSavingPromo}
                  className="px-8 py-3 bg-gold text-dark rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px] justify-center"
                >
                  {isSavingPromo ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Salvando...
                    </>
                  ) : (
                    <><Save size={16}/> Salvar Promoção</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE ADICIONAR PRODUTO */}
      <AnimatePresence>
        {addingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              onClick={() => setAddingItem(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-lg bg-dark border border-gold/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gold/10 flex justify-between items-center bg-darker">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gold">Adicionar Produto</h3>
                  <p className="text-[10px] uppercase tracking-widest text-platinum/40">Novo item no cardápio</p>
                </div>
                <button 
                  onClick={() => setAddingItem(false)} 
                  className="text-platinum/50 hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateItem} className="p-8 space-y-5 overflow-y-auto max-h-[70vh]">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Nome do Produto *</label>
                  <input 
                    required 
                    type="text" 
                    value={newItem.name} 
                    onChange={e => setNewItem({...newItem, name: e.target.value})} 
                    className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white font-bold" 
                    placeholder="Ex: Batata Frita Simples" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Categoria *</label>
                  <input 
                    required 
                    type="text" 
                    list="categories-list"
                    value={newItem.category} 
                    onChange={e => setNewItem({...newItem, category: e.target.value})} 
                    className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white" 
                    placeholder="Ex: Petiscos, Drinks..." 
                  />
                  <datalist id="categories-list">
                    {categories.filter(c => c !== 'Todos').map(cat => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Ingredientes / Descrição</label>
                  <textarea 
                    value={newItem.description || ''} 
                    onChange={e => setNewItem({...newItem, description: e.target.value})} 
                    className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm h-20 resize-none rounded-xl text-white" 
                    placeholder="Ex: 400g, acompanha molho..." 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Preço (R$) *</label>
                    <input 
                      required 
                      type="number" 
                      step="0.01" 
                      value={newItem.price as number || ''} 
                      onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})} 
                      className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white font-bold" 
                      placeholder="29.90" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Código (opcional)</label>
                    <input 
                      type="text" 
                      value={newItem.code || ''} 
                      onChange={e => setNewItem({...newItem, code: e.target.value})} 
                      className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white" 
                      placeholder="Ex: 101" 
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">URL da Imagem</label>
                  <input 
                    type="text" 
                    value={newItem.image || ''} 
                    onChange={e => setNewItem({...newItem, image: e.target.value})} 
                    className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white" 
                    placeholder="https://..." 
                  />
                  <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center">
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gold/20 bg-white/5 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-dark transition-all">
                      <Upload size={14} />
                      {isUploadingImage ? 'Enviando...' : 'Escolher arquivo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={isUploadingImage}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateItemImageFromFile(file, 'new');
                        }}
                      />
                    </label>
                    {newItem.image && (
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-darker p-2 pr-4">
                        <img src={newItem.image} alt="Prévia" className="h-12 w-12 rounded-lg object-cover" />
                        <span className="text-[10px] uppercase tracking-widest text-platinum/45 font-bold">Prévia da imagem</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setAddingItem(false)} 
                    className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-platinum hover:bg-white/5 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-3 bg-gold text-dark rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all"
                  >
                    <Save size={16}/> Adicionar ao Cardápio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          {/* SETTINGS TAB */}
          {activeTab === 'settings' && siteSettings && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-darker p-8 rounded-3xl border border-gold/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-gold mb-2">Abas do Site</h3>
                  <p className="text-sm text-platinum/50">Ligue ou desligue as seções que aparecem no site principal.</p>
                </div>
              </div>

              <div className="bg-darker border border-gold/10 rounded-3xl p-6 md:p-10 space-y-8">
                {[
                  { id: 'showHistoire', label: 'Nossa História', desc: 'Seção sobre a história do Bistrot de Ville' },
                  { id: 'showAvaliacoes', label: 'Avaliações Google', desc: 'Depoimentos e notas de clientes reais' },
                  { id: 'showInstagram', label: 'Instagram Ao Vivo', desc: 'Feed oficial em tempo real do Instagram' },
                  { id: 'showMenu', label: 'Cardápio Digital', desc: 'Seção de pratos em destaque e cardápio na página' },
                  { id: 'showVinhos', label: 'Vinhos & Sobremesas', desc: 'Apresentação da Adega e opções doces' },
                  { id: 'showGaleria', label: 'Galeria', desc: 'Fotos do ambiente e pratos em destaque' },
                  { id: 'showReservas', label: 'Reservas (Final da Página)', desc: 'Área com formulário e botão final de reserva' }
                ].map(section => (
                  <div key={section.id} className="flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-gold/20 transition-all bg-dark">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-platinum">{section.label}</h4>
                      <p className="text-xs text-platinum/40 mt-1">{section.desc}</p>
                    </div>
                    <button 
                      onClick={() => setSiteSettings({...siteSettings, [section.id]: !(siteSettings as any)[section.id]})}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        (siteSettings as any)[section.id] ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-1 left-1 w-6 h-6 bg-dark rounded-full transition-transform ${
                        (siteSettings as any)[section.id] ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}

                <div className="pt-6 border-t border-gold/10 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsSavingSettings(true);
                      try {
                        await updateSiteSettings(siteSettings, activeUnit);
                        alert('Configurações salvas com sucesso!');
                      } catch(e) {
                        alert('Erro ao salvar.');
                      }
                      setIsSavingSettings(false);
                    }}
                    disabled={isSavingSettings}
                    className="px-8 py-3 bg-gold text-dark rounded-xl text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          )}

      {/* MOBILE BOTTOM NAVBAR */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-darker border border-gold/20 rounded-[24px] p-2 flex justify-around shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-40 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all ${
            activeTab === 'menu' ? 'text-gold bg-white/5' : 'text-platinum/50 hover:text-white'
          }`}
        >
          <MenuIcon size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Cardápio</span>
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all ${
            activeTab === 'reservations' ? 'text-gold bg-white/5' : 'text-platinum/50 hover:text-white'
          }`}
        >
          <Calendar size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Reservas</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all ${
            activeTab === 'settings' ? 'text-gold bg-white/5' : 'text-platinum/50 hover:text-white'
          }`}
        >
          <Settings size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Config</span>
        </button>
      </nav>
      {/* MODAL DE ADICIONAR CATEGORIA */}
      <AnimatePresence>
        {isAddingCategory && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-dark border border-gold/20 rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setIsAddingCategory(false)}
                className="absolute top-6 right-6 text-platinum/50 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="p-8 pb-6 border-b border-white/5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold/10 text-gold mb-6">
                  <Tag size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gold">Adicionar Categoria</h3>
                <p className="text-sm text-platinum/50 mt-2">Crie uma nova categoria para agrupar seus produtos.</p>
              </div>

              <div className="p-8">
                <label className="text-[10px] uppercase tracking-widest text-platinum/50 font-bold ml-1 mb-2 block">Nome da Categoria *</label>
                <input 
                  autoFocus
                  required 
                  type="text" 
                  value={newCategoryName} 
                  onChange={e => setNewCategoryName(e.target.value)} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleCreateCategory();
                  }}
                  className="w-full bg-darker border border-white/10 p-4 focus:border-gold outline-none text-sm rounded-xl text-white font-bold" 
                  placeholder="Ex: Bebidas Quentes" 
                />
              </div>

              <div className="p-6 border-t border-white/5 flex gap-4 bg-dark/50">
                <button 
                  onClick={() => setIsAddingCategory(false)}
                  className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-platinum/50 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleCreateCategory}
                  disabled={!newCategoryName.trim()}
                  className="flex-1 py-4 bg-gold text-dark rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Salvar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
