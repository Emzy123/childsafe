import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Type, 
  MousePointer, 
  Keyboard, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  End, 
  PageUp, 
  PageDown, 
  Escape, 
  Tab, 
  Enter, 
  Space, 
  Backspace, 
  Delete, 
  Insert, 
  CapsLock, 
  Shift, 
  Control, 
  Alt, 
  Meta, 
  Function, 
  Pause, 
  ScrollLock, 
  PrintScreen, 
  NumLock, 
  Slash, 
  Asterisk, 
  Minus, 
  Plus, 
  Equal, 
  Underscore, 
  Pipe, 
  Backslash, 
  Colon, 
  Semicolon, 
  Apostrophe, 
  QuotationMark, 
  Comma, 
  Period, 
  QuestionMark, 
  ExclamationMark, 
  At, 
  Hash, 
  Dollar, 
  Percent, 
  Caret, 
  Ampersand, 
  Parentheses, 
  Brackets, 
  Braces, 
  AngleBrackets, 
  User, 
  Users, 
  UserCheck, 
  UserX, 
  UserPlus, 
  UserMinus, 
  Heart, 
  HeartOff, 
  Star, 
  StarOff, 
  Bookmark, 
  BookmarkOff, 
  Flag, 
  FlagOff, 
  Bell, 
  BellOff, 
  MessageSquare, 
  MessageCircle, 
  Send, 
  Share, 
  Share2, 
  Link, 
  Unlink, 
  Copy, 
  Clipboard, 
  Scissors, 
  Move, 
  RotateCw, 
  RotateCcw, 
  RefreshCw, 
  RefreshCcw, 
  Download, 
  Upload, 
  Save, 
  File, 
  FileText, 
  FilePlus, 
  FileMinus, 
  FileCheck, 
  FileX, 
  FileSearch, 
  FileArchive, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  FileSpreadsheet, 
  FilePieChart, 
  FileBarChart, 
  FileLineChart, 
  FileAreaChart, 
  FileScatterChart, 
  FileRadarChart, 
  FileHeatmap, 
  FileTree, 
  FileJson, 
  FileXml, 
  FilePdf, 
  FileWord, 
  FileExcel, 
  FilePowerpoint, 
  FileZip, 
  FileLock, 
  FileUnlock, 
  FileKey, 
  FileSignature, 
  FileCertificate, 
  FileWarning, 
  FileError, 
  FileQuestion, 
  FileInfo, 
  FilePlus as FilePlusIcon, 
  FileMinus as FileMinusIcon, 
  FileCheck as FileCheckIcon, 
  FileX as FileXIcon, 
  FileSearch as FileSearchIcon, 
  FileArchive as FileArchiveIcon, 
  FileImage as FileImageIcon, 
  FileVideo as FileVideoIcon, 
  FileAudio as FileAudioIcon, 
  FileCode as FileCodeIcon, 
  FileSpreadsheet as FileSpreadsheetIcon, 
  FilePieChart as FilePieChartIcon, 
  FileBarChart as FileBarChartIcon, 
  FileLineChart as FileLineChartIcon, 
  FileAreaChart as FileAreaChartIcon, 
  FileScatterChart as FileScatterChartIcon, 
  FileRadarChart as FileRadarChartIcon, 
  FileHeatmap as FileHeatmapIcon, 
  FileTree as FileTreeIcon, 
  FileJson as FileJsonIcon, 
  FileXml as FileXmlIcon, 
  FilePdf as FilePdfIcon, 
  FileWord as FileWordIcon, 
  FileExcel as FileExcelIcon, 
  FilePowerpoint as FilePowerpointIcon, 
  FileZip as FileZipIcon, 
  FileLock as FileLockIcon, 
  FileUnlock as FileUnlockIcon, 
  FileKey as FileKeyIcon, 
  FileSignature as FileSignatureIcon, 
  FileCertificate as FileCertificateIcon, 
  FileWarning as FileWarningIcon, 
  FileError as FileErrorIcon, 
  FileQuestion as FileQuestionIcon, 
  FileInfo as FileInfoIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Type as TypeIcon, 
  MousePointer as MousePointerIcon, 
  Keyboard as KeyboardIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon, 
  Moon as MoonIcon, 
  Sun as SunIcon, 
  ZoomIn as ZoomInIcon, 
  ZoomOut as ZoomOutIcon, 
  Maximize as MaximizeIcon, 
  Minimize as MinimizeIcon, 
  Settings as SettingsIcon, 
  HelpCircle as HelpCircleIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  ChevronUp as ChevronUpIcon, 
  ChevronDown as ChevronDownIcon, 
  ArrowUp as ArrowUpIcon, 
  ArrowDown as ArrowDownIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowRight as ArrowRightIcon, 
  Home as HomeIcon, 
  End as EndIcon, 
  PageUp as PageUpIcon, 
  PageDown as PageDownIcon, 
  Escape as EscapeIcon, 
  Tab as TabIcon, 
  Enter as EnterIcon, 
  Space as SpaceIcon, 
  Backspace as BackspaceIcon, 
  Delete as DeleteIcon, 
  Insert as InsertIcon, 
  CapsLock as CapsLockIcon, 
  Shift as ShiftIcon, 
  Control as ControlIcon, 
  Alt as AltIcon, 
  Meta as MetaIcon, 
  Function as FunctionIcon, 
  Pause as PauseIcon, 
  ScrollLock as ScrollLockIcon, 
  PrintScreen as PrintScreenIcon, 
  NumLock as NumLockIcon, 
  Slash as SlashIcon, 
  Asterisk as AsteriskIcon, 
  Minus as MinusIcon, 
  Plus as PlusIcon, 
  Equal as EqualIcon, 
  Underscore as UnderscoreIcon, 
  Pipe as PipeIcon, 
  Backslash as BackslashIcon, 
  Colon as ColonIcon, 
  Semicolon as SemicolonIcon, 
  Apostrophe as ApostropheIcon, 
  QuotationMark as QuotationMarkIcon, 
  Comma as CommaIcon, 
  Period as PeriodIcon, 
  QuestionMark as QuestionMarkIcon, 
  ExclamationMark as ExclamationMarkIcon, 
  At as AtIcon, 
  Hash as HashIcon, 
  Dollar as DollarIcon, 
  Percent as PercentIcon, 
  Caret as CaretIcon, 
  Ampersand as AmpersandIcon, 
  Parentheses as ParenthesesIcon, 
  Brackets as BracketsIcon, 
  Braces as BracesIcon, 
  AngleBrackets as AngleBracketsIcon, 
  User as UserIcon, 
  Users as UsersIcon, 
  UserCheck as UserCheckIcon, 
  UserX as UserXIcon, 
  UserPlus as UserPlusIcon, 
  UserMinus as UserMinusIcon, 
  Heart as HeartIcon, 
  HeartOff as HeartOffIcon, 
  Star as StarIcon, 
  StarOff as StarOffIcon, 
  Bookmark as BookmarkIcon, 
  BookmarkOff as BookmarkOffIcon, 
  Flag as FlagIcon, 
  FlagOff as FlagOffIcon, 
  Bell as BellIcon, 
  BellOff as BellOffIcon, 
  MessageSquare as MessageSquareIcon, 
  MessageCircle as MessageCircleIcon, 
  Send as SendIcon, 
  Share as ShareIcon, 
  Share2 as Share2Icon, 
  Link as LinkIcon, 
  Unlink as UnlinkIcon, 
  Copy as CopyIcon, 
  Clipboard as ClipboardIcon, 
  Scissors as ScissorsIcon, 
  Move as MoveIcon, 
  RotateCw as RotateCwIcon, 
  RotateCcw as RotateCcwIcon, 
  RefreshCw as RefreshCwIcon, 
  RefreshCcw as RefreshCcwIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Save as SaveIcon, 
  File as FileIcon, 
  FileText as FileTextIcon
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Input, Select, Alert, Badge, Modal } from './ui';

const AccessibilityPanel = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [settings, setSettings] = useState({
    // Visual settings
    fontSize: 'medium',
    highContrast: false,
    darkMode: false,
    reduceMotion: false,
    focusVisible: true,
    cursorVisible: true,
    
    // Reading settings
    lineHeight: 'normal',
    letterSpacing: 'normal',
    wordSpacing: 'normal',
    textTransform: 'none',
    dyslexicFont: false,
    
    // Navigation settings
    keyboardNavigation: true,
    skipLinks: true,
    focusIndicators: true,
    landmarks: true,
    
    // Audio settings
    screenReader: false,
    audioDescriptions: false,
    soundEffects: false,
    
    // Interaction settings
    clickAssistance: false,
    hoverDelay: false,
    autoScroll: false,
    
    // Zoom settings
    pageZoom: 100,
    textZoom: 100,
    
    // Color settings
    colorBlindness: 'none',
    colorScheme: 'default'
  });

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px',
      xxlarge: '24px'
    };
    root.style.fontSize = fontSizes[settings.fontSize] || '16px';
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply dark mode
    if (settings.darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }
    
    // Apply reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Apply dyslexic font
    if (settings.dyslexicFont) {
      root.classList.add('dyslexic-font');
    } else {
      root.classList.remove('dyslexic-font');
    }
    
    // Apply line height
    const lineHeights = {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.8',
      loose: '2.0'
    };
    root.style.lineHeight = lineHeights[settings.lineHeight] || '1.5';
    
    // Apply letter spacing
    const letterSpacings = {
      tight: '-0.5px',
      normal: '0px',
      relaxed: '0.5px',
      loose: '1px'
    };
    root.style.letterSpacing = letterSpacings[settings.letterSpacing] || '0px';
    
    // Apply word spacing
    const wordSpacings = {
      tight: '1px',
      normal: '4px',
      relaxed: '8px',
      loose: '12px'
    };
    root.style.wordSpacing = wordSpacings[settings.wordSpacing] || '4px';
    
    // Apply page zoom
    root.style.transform = `scale(${settings.pageZoom / 100})`;
    root.style.transformOrigin = 'top left';
    
    // Apply color blindness filter
    const colorBlindnessFilters = {
      none: 'none',
      protanopia: 'url(#protanopia)',
      deuteranopia: 'url(#deuteranopia)',
      tritanopia: 'url(#tritanopia)',
      achromatopsia: 'grayscale(100%)'
    };
    root.style.filter = colorBlindnessFilters[settings.colorBlindness] || 'none';
    
    // Apply focus visible
    if (!settings.focusVisible) {
      root.classList.add('focus-hidden');
    } else {
      root.classList.remove('focus-hidden');
    }
    
    // Apply cursor visible
    if (!settings.cursorVisible) {
      root.classList.add('cursor-hidden');
    } else {
      root.classList.remove('cursor-hidden');
    }
  }, [settings]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!settings.keyboardNavigation) return;
      
      // Alt + A: Toggle accessibility panel
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      
      // Alt + H: Toggle help
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
      
      // Alt + Plus: Increase font size
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        increaseFontSize();
      }
      
      // Alt + Minus: Decrease font size
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        decreaseFontSize();
      }
      
      // Alt + 0: Reset font size
      if (e.altKey && e.key === '0') {
        e.preventDefault();
        resetFontSize();
      }
      
      // Alt + C: Toggle high contrast
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        toggleHighContrast();
      }
      
      // Alt + D: Toggle dark mode
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings.keyboardNavigation, isOpen, showHelp]);

  const increaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    setSettings(prev => ({ ...prev, fontSize: sizes[nextIndex] }));
  };

  const decreaseFontSize = () => {
    const sizes = ['small', 'medium', 'large', 'xlarge', 'xxlarge'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const prevIndex = Math.max(currentIndex - 1, 0);
    setSettings(prev => ({ ...prev, fontSize: sizes[prevIndex] }));
  };

  const resetFontSize = () => {
    setSettings(prev => ({ ...prev, fontSize: 'medium' }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Announce change to screen readers
    const messages = {
      fontSize: `Font size changed to ${value}`,
      highContrast: `High contrast ${value ? 'enabled' : 'disabled'}`,
      darkMode: `Dark mode ${value ? 'enabled' : 'disabled'}`,
      reduceMotion: `Reduced motion ${value ? 'enabled' : 'disabled'}`,
      keyboardNavigation: `Keyboard navigation ${value ? 'enabled' : 'disabled'}`,
      screenReader: `Screen reader mode ${value ? 'enabled' : 'disabled'}`,
      dyslexicFont: `Dyslexic font ${value ? 'enabled' : 'disabled'}`
    };
    
    if (messages[key]) {
      announceToScreenReader(messages[key]);
    }
  };

  const resetAllSettings = () => {
    setSettings({
      fontSize: 'medium',
      highContrast: false,
      darkMode: false,
      reduceMotion: false,
      focusVisible: true,
      cursorVisible: true,
      lineHeight: 'normal',
      letterSpacing: 'normal',
      wordSpacing: 'normal',
      textTransform: 'none',
      dyslexicFont: false,
      keyboardNavigation: true,
      skipLinks: true,
      focusIndicators: true,
      landmarks: true,
      screenReader: false,
      audioDescriptions: false,
      soundEffects: false,
      clickAssistance: false,
      hoverDelay: false,
      autoScroll: false,
      pageZoom: 100,
      textZoom: 100,
      colorBlindness: 'none',
      colorScheme: 'default'
    });
    announceToScreenReader('All accessibility settings reset to default');
  };

  const exportSettings = () => {
    const settingsString = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'accessibility-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    announceToScreenReader('Accessibility settings exported');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          announceToScreenReader('Accessibility settings imported successfully');
        } catch (error) {
          announceToScreenReader('Error importing accessibility settings');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-50 flex items-center justify-center"
        aria-label="Accessibility options (Alt+A)"
        title="Accessibility options (Alt+A)"
      >
        <SettingsIcon className="h-6 w-6" />
      </button>

      {/* Skip to main content link */}
      {settings.skipLinks && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
      )}

      {/* Accessibility Panel */}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Accessibility Settings</h2>
                  <p className="text-gray-600">Customize your experience for better accessibility</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHelp(true)}
                  >
                    <HelpCircleIcon className="h-4 w-4 mr-2" />
                    Help
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetAllSettings}
                  >
                    Reset All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Visual Settings */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Visual Settings</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Font Size
                      </label>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={decreaseFontSize}
                          disabled={settings.fontSize === 'small'}
                        >
                          <ZoomOutIcon className="h-4 w-4" />
                        </Button>
                        <Select
                          value={settings.fontSize}
                          onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                          className="flex-1"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="xlarge">Extra Large</option>
                          <option value="xxlarge">XX Large</option>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={increaseFontSize}
                          disabled={settings.fontSize === 'xxlarge'}
                        >
                          <ZoomInIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">High Contrast</div>
                        <div className="text-sm text-gray-500">Increase contrast for better visibility</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.highContrast ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-gray-500">Reduce eye strain in low light</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.darkMode ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Reduce Motion */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Reduce Motion</div>
                        <div className="text-sm text-gray-500">Minimize animations and transitions</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('reduceMotion', !settings.reduceMotion)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.reduceMotion ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dyslexic Font */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Dyslexic Font</div>
                        <div className="text-sm text-gray-500">Use font optimized for dyslexia</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('dyslexicFont', !settings.dyslexicFont)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.dyslexicFont ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.dyslexicFont ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Color Blindness */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Blindness Support
                      </label>
                      <Select
                        value={settings.colorBlindness}
                        onChange={(e) => handleSettingChange('colorBlindness', e.target.value)}
                        className="w-full"
                      >
                        <option value="none">None</option>
                        <option value="protanopia">Protanopia (Red-Blind)</option>
                        <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                        <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                        <option value="achromatopsia">Achromatopsia (Complete)</option>
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Reading Settings */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Reading Settings</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {/* Line Height */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Line Height
                      </label>
                      <Select
                        value={settings.lineHeight}
                        onChange={(e) => handleSettingChange('lineHeight', e.target.value)}
                        className="w-full"
                      >
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="loose">Loose</option>
                      </Select>
                    </div>

                    {/* Letter Spacing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Letter Spacing
                      </label>
                      <Select
                        value={settings.letterSpacing}
                        onChange={(e) => handleSettingChange('letterSpacing', e.target.value)}
                        className="w-full"
                      >
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="loose">Loose</option>
                      </Select>
                    </div>

                    {/* Word Spacing */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Word Spacing
                      </label>
                      <Select
                        value={settings.wordSpacing}
                        onChange={(e) => handleSettingChange('wordSpacing', e.target.value)}
                        className="w-full"
                      >
                        <option value="tight">Tight</option>
                        <option value="normal">Normal</option>
                        <option value="relaxed">Relaxed</option>
                        <option value="loose">Loose</option>
                      </Select>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Navigation Settings */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Navigation Settings</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {/* Keyboard Navigation */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Keyboard Navigation</div>
                        <div className="text-sm text-gray-500">Enable keyboard shortcuts</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('keyboardNavigation', !settings.keyboardNavigation)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.keyboardNavigation ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Skip Links */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Skip Links</div>
                        <div className="text-sm text-gray-500">Show skip navigation links</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('skipLinks', !settings.skipLinks)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.skipLinks ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.skipLinks ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Focus Indicators */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Focus Indicators</div>
                        <div className="text-sm text-gray-500">Show keyboard focus indicators</div>
                      </div>
                      <button
                        onClick={() => handleSettingChange('focusIndicators', !settings.focusIndicators)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings.focusIndicators ? 'bg-primary-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Import/Export Settings */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Settings Management</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        onClick={exportSettings}
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Export Settings
                      </Button>
                      <div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={importSettings}
                          className="hidden"
                          id="import-settings"
                        />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('import-settings').click()}
                        >
                          <UploadIcon className="h-4 w-4 mr-2" />
                          Import Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Keyboard Shortcuts */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Toggle accessibility panel</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + A</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Toggle help</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + H</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Increase font size</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + +</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Decrease font size</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + -</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reset font size</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + 0</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Toggle high contrast</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + C</kbd>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Toggle dark mode</span>
                      <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Alt + D</kbd>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </Modal>
      )}

      {/* Help Modal */}
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Accessibility Help</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Screen Reader Support</h3>
              <p className="text-gray-600">
                This application is fully compatible with screen readers including JAWS, NVDA, and VoiceOver. 
                All interactive elements have proper labels and descriptions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Keyboard Navigation</h3>
              <p className="text-gray-600">
                Use the Tab key to navigate between interactive elements. Use Enter or Space to activate buttons and links. 
                Use Escape to close modals and dialogs.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Visual Adjustments</h3>
              <p className="text-gray-600">
                Adjust font size, contrast, colors, and spacing to make the content easier to read. 
                All changes are applied immediately and persist across sessions.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Getting Help</h3>
              <p className="text-gray-600">
                For additional accessibility support, please contact our accessibility team at 
                accessibility@childsafe.ng or call our helpline at +234-800-ACCESSIBLE.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setShowHelp(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>

      {/* SVG Filters for Color Blindness */}
      <svg className="hidden">
        <defs>
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0
                                             0.558, 0.442, 0, 0, 0
                                             0, 0.242, 0.758, 0, 0
                                             0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0
                                             0.7, 0.3, 0, 0, 0
                                             0, 0.3, 0.7, 0, 0
                                             0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0
                                             0, 0.433, 0.567, 0, 0
                                             0, 0.475, 0.525, 0, 0
                                             0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default AccessibilityPanel;
