<script>
    import "../app.css";
    import Navigation from "../components/Navigation.svelte";
    import Footer from "../components/Footer.svelte";
  </script>
  
  <Navigation />

  <main>
    <slot></slot>
  </main>
  
  <Footer />

  
