import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Keyboard, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  End, 
  PageUp, 
  PageDown, 
  Tab, 
  Enter, 
  Space, 
  Escape, 
  Delete, 
  Backspace, 
  Shift, 
  Control, 
  Alt, 
  Meta, 
  HelpCircle, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Zap, 
  Navigation, 
  Compass, 
  MapPin, 
  Target, 
  Focus, 
  Layers, 
  Grid, 
  List, 
  Menu, 
  X, 
  Plus, 
  Minus, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  SkipForward, 
  SkipBack, 
  FastForward, 
  Rewind, 
  Play, 
  Pause, 
  Square, 
  Circle, 
  Triangle, 
  Hexagon, 
  Octagon, 
  Pentagon, 
  Star, 
  Heart, 
  Bookmark, 
  Flag, 
  Tag, 
  Hash, 
  AtSign, 
  DollarSign, 
  Percent, 
  Ampersand, 
  Asterisk, 
  Parentheses, 
  Brackets, 
  Braces, 
  AngleBrackets, 
  Slash, 
  Backslash, 
  Pipe, 
  Underscore, 
  Equal, 
  Plus as PlusIcon, 
  Minus as MinusIcon, 
  X as XIcon, 
  Eye as EyeIcon, 
  EyeOff as EyeOffIcon, 
  Keyboard as KeyboardIcon, 
  ArrowUp as ArrowUpIcon, 
  ArrowDown as ArrowDownIcon, 
  ArrowLeft as ArrowLeftIcon, 
  ArrowRight as ArrowRightIcon, 
  Home as HomeIcon, 
  End as EndIcon, 
  PageUp as PageUpIcon, 
  PageDown as PageDownIcon, 
  Tab as TabIcon, 
  Enter as EnterIcon, 
  Space as SpaceIcon, 
  Escape as EscapeIcon, 
  Delete as DeleteIcon, 
  Backspace as BackspaceIcon, 
  Shift as ShiftIcon, 
  Control as ControlIcon, 
  Alt as AltIcon, 
  Meta as MetaIcon, 
  HelpCircle as HelpCircleIcon, 
  Info as InfoIcon, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon, 
  Volume2 as Volume2Icon, 
  VolumeX as VolumeXIcon, 
  Zap as ZapIcon, 
  Navigation as NavigationIcon, 
  Compass as CompassIcon, 
  MapPin as MapPinIcon, 
  Target as TargetIcon, 
  Focus as FocusIcon, 
  Layers as LayersIcon, 
  Grid as GridIcon, 
  List as ListIcon, 
  Menu as MenuIcon, 
  ChevronUp as ChevronUpIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon, 
  SkipForward as SkipForwardIcon, 
  SkipBack as SkipBackIcon, 
  FastForward as FastForwardIcon, 
  Rewind as RewindIcon, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  Square as SquareIcon, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon, 
  Hexagon as HexagonIcon, 
  Octagon as OctagonIcon, 
  Pentagon as PentagonIcon, 
  Star as StarIcon, 
  Heart as HeartIcon, 
  Bookmark as BookmarkIcon, 
  Flag as FlagIcon, 
  Tag as TagIcon, 
  Hash as HashIcon, 
  AtSign as AtSignIcon, 
  DollarSign as DollarSignIcon, 
  Percent as PercentIcon, 
  Ampersand as AmpersandIcon, 
  Asterisk as AsteriskIcon, 
  Parentheses as ParenthesesIcon, 
  Brackets as BracketsIcon, 
  Braces as BracesIcon, 
  AngleBrackets as AngleBracketsIcon, 
  Slash as SlashIcon, 
  Backslash as BackslashIcon, 
  Pipe as PipeIcon, 
  Underscore as UnderscoreIcon, 
  Equal as EqualIcon
} from 'lucide-react';
import { Button, Card, CardBody, CardHeader, Alert, Badge } from './ui';

const KeyboardNavigation = () => {
  const { user } = useAuth();
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);
  const [focusHistory, setFocusHistory] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [navigationMode, setNavigationMode] = useState('normal'); // normal, landmarks, headings, links, forms
  const [focusTrapActive, setFocusTrapActive] = useState(false);
  const focusableElementsRef = useRef([]);
  const currentFocusIndexRef = useRef(0);
  const announcementTimeoutRef = useRef(null);

  // Detect keyboard user
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only detect keyboard navigation, not typing in inputs
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.contentEditable !== 'true') {
        setIsKeyboardUser(true);
        document.body.setAttribute('data-keyboard-user', 'true');
      }
    };

    const handleMouseDown = () => {
      setIsKeyboardUser(false);
      document.body.removeAttribute('data-keyboard-user');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Announce to screen readers
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date()
    };
    
    setAnnouncements(prev => [...prev, announcement]);
    
    // Create live region for screen readers
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.className = 'sr-only';
    liveRegion.textContent = message;
    document.body.appendChild(liveRegion);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion);
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 1000);
  }, []);

  // Get focusable elements
  const getFocusableElements = useCallback((container = document) => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      'summary',
      'iframe',
      'object',
      'embed'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)).filter(element => {
      // Check if element is visible and not hidden
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0' &&
             element.offsetWidth > 0 && 
             element.offsetHeight > 0;
    });
  }, []);

  // Navigate to next/previous element
  const navigateElements = useCallback((direction) => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    let currentIndex = elements.indexOf(document.activeElement);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex;
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % elements.length;
        break;
      case 'prev':
        nextIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
        break;
      case 'first':
        nextIndex = 0;
        break;
      case 'last':
        nextIndex = elements.length - 1;
        break;
      default:
        return;
    }

    const nextElement = elements[nextIndex];
    nextElement.focus();
    setCurrentFocus(nextElement);
    setFocusHistory(prev => [...prev, nextElement]);
    
    // Announce element info to screen readers
    const elementInfo = getElementInfo(nextElement);
    announce(elementInfo);
  }, [getFocusableElements, announce]);

  // Get element information for screen readers
  const getElementInfo = (element) => {
    const tagName = element.tagName.toLowerCase();
    const label = element.getAttribute('aria-label') || 
                  element.textContent?.trim() || 
                  element.getAttribute('title') || 
                  element.getAttribute('alt') || 
                  element.placeholder || 
                  element.value || 
                  `${tagName} element`;
    
    const role = element.getAttribute('role') || getImplicitRole(tagName);
    const state = getElementState(element);
    
    return `${label}, ${role}${state ? `, ${state}` : ''}`;
  };

  // Get implicit role for element
  const getImplicitRole = (tagName) => {
    const roles = {
      'button': 'button',
      'a': 'link',
      'input': 'input',
      'select': 'combobox',
      'textarea': 'textbox',
      'h1': 'heading level 1',
      'h2': 'heading level 2',
      'h3': 'heading level 3',
      'h4': 'heading level 4',
      'h5': 'heading level 5',
      'h6': 'heading level 6',
      'nav': 'navigation',
      'main': 'main',
      'header': 'banner',
      'footer': 'contentinfo',
      'aside': 'complementary',
      'section': 'region',
      'article': 'article',
      'ul': 'list',
      'ol': 'list',
      'li': 'listitem',
      'table': 'table',
      'tr': 'row',
      'td': 'cell',
      'th': 'columnheader'
    };
    return roles[tagName] || tagName;
  };

  // Get element state
  const getElementState = (element) => {
    const states = [];
    
    if (element.disabled) states.push('disabled');
    if (element.required) states.push('required');
    if (element.checked) states.push('checked');
    if (element.selected) states.push('selected');
    if (element.readOnly) states.push('readonly');
    if (element.getAttribute('aria-expanded') === 'true') states.push('expanded');
    if (element.getAttribute('aria-expanded') === 'false') states.push('collapsed');
    if (element.getAttribute('aria-pressed') === 'true') states.push('pressed');
    if (element.getAttribute('aria-busy') === 'true') states.push('busy');
    if (element.getAttribute('aria-hidden') === 'true') states.push('hidden');
    
    return states.join(', ');
  };

  // Navigate by landmarks
  const navigateLandmarks = useCallback((direction) => {
    const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"], [role="search"], [role="region"], nav, main, header, footer, aside, section');
    
    if (landmarks.length === 0) {
      announce('No landmarks found');
      return;
    }

    const landmarkArray = Array.from(landmarks);
    let currentIndex = landmarkArray.findIndex(el => el.contains(document.activeElement));
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex;
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % landmarkArray.length;
        break;
      case 'prev':
        nextIndex = currentIndex === 0 ? landmarkArray.length - 1 : currentIndex - 1;
        break;
      default:
        return;
    }

    const nextLandmark = landmarkArray[nextIndex];
    const firstFocusable = getFocusableElements(nextLandmark)[0];
    
    if (firstFocusable) {
      firstFocusable.focus();
      const landmarkInfo = getElementInfo(nextLandmark);
      announce(`Navigated to ${landmarkInfo}`);
    }
  }, [getFocusableElements, announce, getElementInfo]);

  // Navigate by headings
  const navigateHeadings = useCallback((direction) => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      announce('No headings found');
      return;
    }

    const headingArray = Array.from(headings);
    let currentIndex = headingArray.findIndex(el => el === document.activeElement);
    if (currentIndex === -1) currentIndex = 0;

    let nextIndex;
    switch (direction) {
      case 'next':
        nextIndex = (currentIndex + 1) % headingArray.length;
        break;
      case 'prev':
        nextIndex = currentIndex === 0 ? headingArray.length - 1 : currentIndex - 1;
        break;
      default:
        return;
    }

    const nextHeading = headingArray[nextIndex];
    nextHeading.focus();
    const headingInfo = getElementInfo(nextHeading);
    announce(`Navigated to ${headingInfo}`);
  }, [announce, getElementInfo]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle keyboard shortcuts when not typing
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
        return;
      }

      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const alt = e.altKey;
      const shift = e.shiftKey;

      // Navigation shortcuts
      if (alt && key === 'tab') {
        e.preventDefault();
        navigateElements(shift ? 'prev' : 'next');
      } else if (alt && key === 'arrowdown') {
        e.preventDefault();
        navigateElements('next');
      } else if (alt && key === 'arrowup') {
        e.preventDefault();
        navigateElements('prev');
      } else if (alt && key === 'home') {
        e.preventDefault();
        navigateElements('first');
      } else if (alt && key === 'end') {
        e.preventDefault();
        navigateElements('last');
      }
      
      // Landmark navigation
      else if (alt && key === 'l') {
        e.preventDefault();
        setNavigationMode(navigationMode === 'landmarks' ? 'normal' : 'landmarks');
        announce(`Landmark navigation ${navigationMode === 'landmarks' ? 'disabled' : 'enabled'}`);
      } else if (alt && key === 'arrowright' && navigationMode === 'landmarks') {
        e.preventDefault();
        navigateLandmarks('next');
      } else if (alt && key === 'arrowleft' && navigationMode === 'landmarks') {
        e.preventDefault();
        navigateLandmarks('prev');
      }
      
      // Heading navigation
      else if (alt && key === 'h') {
        e.preventDefault();
        setNavigationMode(navigationMode === 'headings' ? 'normal' : 'headings');
        announce(`Heading navigation ${navigationMode === 'headings' ? 'disabled' : 'enabled'}`);
      } else if (alt && key === 'arrowdown' && navigationMode === 'headings') {
        e.preventDefault();
        navigateHeadings('next');
      } else if (alt && key === 'arrowup' && navigationMode === 'headings') {
        e.preventDefault();
        navigateHeadings('prev');
      }
      
      // Help and information
      else if (alt && key === '?') {
        e.preventDefault();
        setShowKeyboardHelp(true);
        announce('Keyboard shortcuts help opened');
      } else if (alt && key === 's') {
        e.preventDefault();
        announceCurrentPage();
      }
      
      // Screen reader announcements
      else if (alt && key === 'a') {
        e.preventDefault();
        announce('Screen reader mode active');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateElements, navigateLandmarks, navigateHeadings, navigationMode, announce]);

  // Announce current page structure
  const announceCurrentPage = useCallback(() => {
    const title = document.title;
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    const landmarks = document.querySelectorAll('[role="navigation"], [role="main"], [role="banner"], [role="contentinfo"], [role="complementary"]');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const links = document.querySelectorAll('a[href]');
    const focusable = getFocusableElements();
    
    const announcement = `Page: ${title}. ${landmarks.length} landmarks, ${headings.length} headings, ${links.length} links, ${focusable.length} focusable elements. Current focus: ${getElementInfo(document.activeElement)}`;
    
    announce(announcement, 'assertive');
  }, [getFocusableElements, getElementInfo, announce]);

  // Focus trap for modals
  const activateFocusTrap = useCallback((container) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTrapKeydown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTrapKeydown);
    setFocusTrapActive(true);

    return () => {
      container.removeEventListener('keydown', handleTrapKeydown);
      setFocusTrapActive(false);
    };
  }, [getFocusableElements]);

  // Add ARIA live regions
  useEffect(() => {
    // Create live regions for screen readers
    const politeRegion = document.createElement('div');
    politeRegion.setAttribute('role', 'status');
    politeRegion.setAttribute('aria-live', 'polite');
    politeRegion.setAttribute('aria-atomic', 'true');
    politeRegion.className = 'sr-only';
    politeRegion.id = 'screen-reader-polite';

    const assertiveRegion = document.createElement('div');
    assertiveRegion.setAttribute('role', 'alert');
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.className = 'sr-only';
    assertiveRegion.id = 'screen-reader-assertive';

    document.body.appendChild(politeRegion);
    document.body.appendChild(assertiveRegion);

    return () => {
      document.body.removeChild(politeRegion);
      document.body.removeChild(assertiveRegion);
    };
  }, []);

  // Keyboard shortcuts help
  const keyboardShortcuts = [
    { key: 'Alt + Tab', description: 'Navigate to next/previous element' },
    { key: 'Alt + Arrow Down', description: 'Navigate to next element' },
    { key: 'Alt + Arrow Up', description: 'Navigate to previous element' },
    { key: 'Alt + Home', description: 'Navigate to first element' },
    { key: 'Alt + End', description: 'Navigate to last element' },
    { key: 'Alt + L', description: 'Toggle landmark navigation' },
    { key: 'Alt + H', description: 'Toggle heading navigation' },
    { key: 'Alt + ?', description: 'Show keyboard shortcuts help' },
    { key: 'Alt + S', description: 'Announce current page structure' },
    { key: 'Alt + A', description: 'Announce screen reader mode' },
    { key: 'Escape', description: 'Close modals and dialogs' },
    { key: 'Enter/Space', description: 'Activate buttons and links' },
    { key: 'Tab', description: 'Navigate between focusable elements' },
    { key: 'Shift + Tab', description: 'Navigate backwards' }
  ];

  if (!isKeyboardUser) {
    return null;
  }

  return (
    <>
      {/* Keyboard User Indicator */}
      <div className="fixed top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm z-50 flex items-center space-x-2">
        <KeyboardIcon className="h-4 w-4" />
        <span>Keyboard Navigation Active</span>
        {navigationMode !== 'normal' && (
          <Badge variant="secondary" size="sm">
            {navigationMode}
          </Badge>
        )}
      </div>

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close help"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Navigation</h3>
                  <div className="space-y-2">
                    {keyboardShortcuts.slice(0, 5).map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <kbd className="px-2 py-1 text-sm bg-gray-200 rounded font-mono">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-gray-600">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Special Navigation</h3>
                  <div className="space-y-2">
                    {keyboardShortcuts.slice(5, 8).map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <kbd className="px-2 py-1 text-sm bg-gray-200 rounded font-mono">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-gray-600">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Screen Reader</h3>
                  <div className="space-y-2">
                    {keyboardShortcuts.slice(8, 11).map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <kbd className="px-2 py-1 text-sm bg-gray-200 rounded font-mono">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-gray-600">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">General</h3>
                  <div className="space-y-2">
                    {keyboardShortcuts.slice(11).map((shortcut, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <kbd className="px-2 py-1 text-sm bg-gray-200 rounded font-mono">
                          {shortcut.key}
                        </kbd>
                        <span className="text-sm text-gray-600">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Announcements (Hidden) */}
      <div className="sr-only">
        <div role="status" aria-live="polite" aria-atomic="true" id="screen-reader-polite"></div>
        <div role="alert" aria-live="assertive" aria-atomic="true" id="screen-reader-assertive"></div>
      </div>

      {/* Focus Indicator Styles */}
      <style jsx>{`
        [data-keyboard-user] *:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        [data-keyboard-user] button:focus,
        [data-keyboard-user] input:focus,
        [data-keyboard-user] select:focus,
        [data-keyboard-user] textarea:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </>
  );
};

export default KeyboardNavigation;
