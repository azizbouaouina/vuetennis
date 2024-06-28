<template>
<div class="nav">
    <NavBar :loggedIn="'true'"   />
  </div>
  <div>
    <h1>Page Not Found</h1>
    <p class="not-found">The page you are looking for does not exist.</p>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'


export default {
    components:{
        NavBar,
    },
    
  name: 'NotFound'
}
</script>

<style scoped>
.nav{
  position: fixed;
  top: 0;
  left: 0;
  color: white;  
  z-index: 2;
}

body{
    margin-top: 100px;
    margin-left: 20px;
    margin-right: 20px;
}

.not-found{
  border: none;
  border-radius: 4px;
  color: #b1112c;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  font-size: 20px; 
  opacity: 0; 
  animation: fadeIn 1s ease-out forwards; 

}

h1 {
  color: #f00; 
  font-weight: bold;
  text-align: left; 
  margin: 20px 0; 
  font-family: 'Helvetica', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
}

@keyframes fadeIn {
  from {
    opacity: 0; 
  }
  to {
    opacity: 1; 
  }
}

</style>
