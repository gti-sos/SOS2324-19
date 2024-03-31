<script>
    import Header from "./Header.svelte";
    import Footer from "./Footer.svelte";
   import { Styles } from '@sveltestrap/sveltestrap';
</script>

 

<Header/>
<hr>
<slot> </slot>
<hr>
<Footer/>