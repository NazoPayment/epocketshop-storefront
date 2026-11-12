import {useState} from 'react';
import {Route, Switch} from 'wouter';
import {LinkProvider} from '@astryxdesign/core/Link';
import {ErrorBoundary} from '@/components/ErrorBoundary';
import {RouterLink} from '@/components/RouterLink';
import {SplashScreen} from '@/components/SplashScreen';
import {CartProvider} from '@/contexts/CartContext';
import {StoreProvider, useStore} from '@/contexts/StoreContext';
import {ThemeModeProvider} from '@/contexts/ThemeModeContext';
import AboutPage from '@/pages/AboutPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import ContactPage from '@/pages/ContactPage';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import StorePage from '@/pages/StorePage';

function Routes() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      {/* Store sub-pages must come before the catch-all store route. */}
      <Route path="/:store/cart" component={CartPage} />
      <Route path="/:store/checkout" component={CheckoutPage} />
      <Route path="/:store/confirmation" component={ConfirmationPage} />
      <Route path="/:store/about" component={AboutPage} />
      <Route path="/:store/contact" component={ContactPage} />
      <Route path="/:store" component={StorePage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const {businessDetails} = useStore();
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <SplashScreen
          splashLogo={businessDetails?.splash_logo}
          onComplete={() => setShowSplash(false)}
        />
      )}
      <Routes />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeModeProvider>
        <LinkProvider component={RouterLink}>
          <StoreProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </StoreProvider>
        </LinkProvider>
      </ThemeModeProvider>
    </ErrorBoundary>
  );
}
