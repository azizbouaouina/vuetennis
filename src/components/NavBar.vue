<template>
<link
href="https://unpkg.com/css.gg@2.0.0/icons/css/tennis.css"
rel="stylesheet"
/>

  <nav >
    

    <div class="navbar" >
        <div class="logo-title"> 
            <div class="title">Tennis Mate</div>
            <div class="logo"><i class="gg-tennis"></i></div>
            </div>
            <div class="menu">
            <div class="home" @click="gotoHome">Home</div>
            <div class="create-match" @click="createTennisMatch">Create a match</div>
        </div>
            <div v-if="loggedIn1==='false'"  class="log-sign" >
            <div class="sign-nav" @click="changePopUpSignUp">Sign up </div>
            <div class="login-nav" @click="changeLogin"> Log in</div>
        </div>
            <div v-if="loggedIn1==='true'" >
            <div @click="toggleDropdown" class="logged" >Profile</div>
            <DropDownProfile :isDropdownOpen="isdown1" @loggedout="changetologgedout"></DropDownProfile>
        </div>
    </div>
  </nav>
</template>

<script>

import DropDownProfile from './DropDownProfile.vue'
import { checkLoggedIn } from '../utils';

export default {
    components:{
        DropDownProfile
    },
    data(){
        return{
            isdown1:false,

        }
    },
    
    props:['loggedIn',],

    computed:{
        
        loggedIn1: function() {
        return this.loggedIn ;
      },

    },

    methods:{

        gotoHome(){
            this.$router.push({name:"home"})
            if (this.$route.name==='home'){
              window.location.reload();

            }
            

        },

        async createTennisMatch() {
            try {
                const isLoggedIn = await checkLoggedIn();

                if (isLoggedIn) {
                    this.$router.push({name:"match"})
                } else {
                alert('You need to log in first');
                }
            } catch (error) {
                console.error('Error checking login status:', error);
            }
        },


        changePopUpSignUp(){
            // this.showSign = true
            this.$emit('show-sign',true)
        },

        changeLogin(){
            this.$emit('show-log',true)
        },
        toggleDropdown() {
            this.isdown1 = !this.isdown1;
        },
        changetologgedout(value){
            this.loggedIn1 = value
            this.isdown1 = !this.isdown1;
            this.$emit('loggin-out',value)
        },

    },



}
</script>


<style scoped>



body {
    /* font-family: 'Montserrat', sans-serif; */
    margin: 0;
    padding: 0;
}


.navbar {
    background: linear-gradient(to right, #204d80, #11556d);
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    z-index: 997;


}
.logo-title{
    display: flex;
}

.logo{
    margin: 5px;
}

.title {
    font-size: 1.5em;
    font-weight: bold;
    margin-left: 15px;
    margin-right: 7px;
    color: #fff;
    cursor: pointer;
}

.gg-tennis{
    margin: 0px;
    width: 20px;
    padding: 0;
}

.menu {
    display: flex;
    justify-content: space-around;
    color: 333;
    text-decoration: none;
    margin-left: 50px;
    width: 300px;
    color: #fff;
    font-size: 1.2em;
}

.log-sign{
  display: flex;
  
  /* justify-content: space-between; */
  /* align-items: center; */

  justify-content: space-around;
  color: 333;
  text-decoration: none;
  width: 200px;
  color: #fff;
  font-size: 1.2em;
  /* border : 5px solid grey; */
}

.login-nav {
    cursor: pointer;
}

.logged{
  display: flex;
  justify-content: flex-end;
  color: 333;
  text-decoration: none;
  width: 180px;
  color: #fff;
  font-size: 1.2em;
  cursor: pointer;
  margin-right: 20px;
  /* border : 5px solid grey */
}
.sign-nav {
    cursor: pointer;
}
.home {
    cursor: pointer;
}
.create-match{
    cursor: pointer;
}


</style>