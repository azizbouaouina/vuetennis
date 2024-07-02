<template>
  <body>
    <header>
      <div>
        <NavBar :loggedIn="loggedIn" :downHome="down" @show-sign="changePopUpSignUp" @show-log="changeLogin" @loggin-out="log_out"  />
      </div>
      <section @click="down=false"  class="description-section">
        <div class="description-content">
          <h1>Welcome to Tennis Mate</h1>
          <p>
          Connect with tennis players in your area for friendly matches and
          improve your game!
          </p>
        </div>
      </section>
    </header>
                <!-- class="js-example-basic-single" -->
    <div >
      <div class="container" >
        <section class="search-section">
          <h2 class="title-container">Find a Tennis Partner</h2>
          <div>
            <form class="form-class" @submit.prevent="submitForm">
              <div class="custom-select">
                <label for="city">Select or Type Your City:</label>
                <select
                id="city"
                name="city"
                v-model="searchData.selectedCity"
                class="select-level"
                placeholder="Select or type a city"
                >
                <option v-for="city in cities" :value="city" :key="city">{{ city }}</option>
                </select>
              </div>

              <div class="custom-select">
                <label for="skill-level">Skill Level:</label>
                <!-- <select id="skill-level" class="js-example-basic-single" > -->
                <select id="skill-level" class="select-level" v-model="searchData.selectedLevel" >
                <option value="" selected disabled></option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                </select>
              </div>

              <div class="custom-select">
                <label for="futureDate">Select a date:</label>
                <input
                type="date"
                id="futureDate"
                name="futureDate"
                v-model="searchData.selectedDate"
                :min="minDate"
                required
                />
              </div>

              <button type="submit" id="find-player">Find a Tennis Partner</button>
            </form>
          </div>
        </section>

        

        <section class="featured-section">
          <h2 class="title-container">Match Opportunities</h2>

          <div class="featured-posts">
            <SignUpForm v-if="showSign" @close="closeSignForm" @showProfileNav="showProfile" />
            <LoginForm v-if="showLogin" @closeLogin="closeLoginForm" @openSign="openSignForm" @showProfileNav="showProfile"/>

            <div v-if="loggedIn=='false'" class="featured-posts">
              <div v-for="postItem in postsData" :key="postItem.Post.id">
              <MatchPosts :date="postItem.Post.datetime" :level="postItem.Post.level" :city="postItem.Post.city" 
              :address="postItem.Post.address" :description="postItem.Post.description" :name="postItem.Post.owner.name" 
              :familyName="postItem.Post.owner.family_name" :imageProfil="postItem.Post.owner.photo"  :gender="postItem.Post.owner.gender"
              :postUserID="postItem.Post.owner.id" :postID="postItem.Post.id" :requesterIds="postItem.voter_ids" :accepted="postItem.accepted"/>
            </div>
            </div>

            <div v-if="loggedIn=='true'" class="featured-posts">
              <div v-for="postItem in sortedPostsData" :key="postItem.Post.id">
              <MatchPosts :date="postItem.Post.datetime" :level="postItem.Post.level" :city="postItem.Post.city" 
              :address="postItem.Post.address" :description="postItem.Post.description" :name="postItem.Post.owner.name" 
              :familyName="postItem.Post.owner.family_name" :imageProfil="postItem.Post.owner.photo"  :gender="postItem.Post.owner.gender"
              :postUserID="postItem.Post.owner.id" :postID="postItem.Post.id" :requesterIds="postItem.voter_ids" :accepted="postItem.accepted" :numberRequests="postItem.votes"/>
            </div>
            </div>
           <!-- <div>{{sortedPosts}}</div>  -->



            

          </div>
        </section>
        
        
      </div>
    </div>
  </body>
</template>

<script scoped>
import MatchPosts from '../components/MatchPosts.vue'
import SignUpForm from '../components/SignUpForm.vue'
import LoginForm from '../components/LoginForm.vue'
import DropDownProfile from '../components/DropDownProfile.vue'
import NavBar from '../components/NavBar.vue'

import { checkLoggedIn as verifyUserLoggedIn } from '../utils';




export default {
  name: 'HomeView',

  components:{
    MatchPosts,
    SignUpForm,
    LoginForm,
    DropDownProfile,
    NavBar,
  },

  data() {
    return {
      searchData:{
        selectedCity: "",
        selectedLevel:"",
        selectedDate: "",
      },
      minDate: "", // This will store the minimum date
      showSign : false,
      showLogin : false,
      loggedIn : 'false',
      down:false,
      cities: require('../assets/commune_data.json').Commune,
      postsData:[],
      sortedPostsData: [],
      user_id: null,

    };
  },



  mounted() {
    // Initialize Select2 after the component is mounted
    $('.js-example-basic-single').select2();

    // Set the minimum date to the current date
    const today = new Date().toISOString().split("T")[0];
    this.minDate = today;
    this.getDataOnMount();
    

  },


  async created(){
    
    await this.checkLoggedIn()
    await this.sortedPosts()
  },


  methods: {

    async sortedPosts() {
      try {
        const data_id = await verifyUserLoggedIn();

        if (data_id) {
      const user_id =parseInt(data_id, 10)          
          // Sort posts based on your criteria
      this.sortedPostsData = this.postsData.sort((a, b) => {
      // Compare dates
      const dateA = new Date(a.Post.datetime);
      const dateB = new Date(b.Post.datetime);

      // First, show posts where postItem.Post.owner_id matches the userID
      if (a.Post.owner.id === user_id && b.Post.owner.id !== user_id) {
        return -1;
      }
      if (a.Post.owner.id !== user_id && b.Post.owner.id === user_id) {
        return 1;
      }

      // Then, show posts where postItem.voter_ids includes userID
      if (
        a.voter_ids.includes(user_id) &&
        !b.voter_ids.includes(user_id)
      ) {
        return -1;
      }
      if (
        !a.voter_ids.includes(user_id) &&
        b.voter_ids.includes(user_id)
      ) {
        return 1;
      }

      // Compare dates for other cases
      return dateA - dateB;
    });


        } else {
          console.error('Failed to fetch data:');
          // Handle the error
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Handle the error
      }
    },

    showProfile(value){
      this.loggedIn = value
    },

    log_out(value){
      this.loggedIn = value
    },


async checkLoggedIn(){

      const token = localStorage.getItem('token')

      if (token){

        try {
        // Make a request to the backend to verify the token using fetch
        const response = await fetch(`http://127.0.0.1:8000/verify?token=${token}`);

        if (!response.ok) {

          window.location.reload();

          return false
          throw new Error('Failed to verify token');
            

        }
        this.loggedIn='true'

        // If the response is successful, the user is authenticated
        
    } catch (error) {
        // If there's an error or the response indicates unauthenticated, handle accordingly
        return { isAuthenticated: false };
        // return false
    }
    return true;

      }
    },

    async getDataOnMount() {
      try {
        const Url = 'http://127.0.0.1:8000/posts/';

        const response = await fetch(Url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Handle the retrieved data as needed
          this.postsData = data;
        } else {
          console.error('Failed to fetch data:', response.statusText);
          // Handle the error
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Handle the error
      }
    },

    async submitForm() {
      try {
      
        const Url = `http://127.0.0.1:8000/posts/filtered/?datetime_filter=${this.searchData.selectedDate}&level_filter=${this.searchData.selectedLevel}&city_filter=${this.searchData.selectedCity}`;
        const response = await fetch(Url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Handle the retrieved data as needed
          this.postsData = data;
        } else {
          console.error('Failed to fetch data:', response.statusText);
          // Handle the error
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Handle the error
      }
    },
  
    changePopUpSignUp(value){
        this.showSign = value
    },
    closeSignForm(value){
      this.showSign=value 
    },

    changeLogin(value){
        this.showLogin = value
    },

    closeLoginForm(value){
      this.showLogin=value 
    },

    openSignForm(value){
      this.showLogin=value 
      this.showSign=!value

    },

    createTennisMatch(){
      if (this.loggedIn=='false'){
        alert('You need to Log in First')
      }
      else{
        this.$router.push({name:"match"})

      }
    }
    
  },

}
</script>

<style>

.title-container{
  color: #333; 
  font-size: 24px; 
  font-weight: bold;
  text-align: left; 
  margin: 20px 0; 
  font-family: 'Helvetica', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
}


#find-player{
  width: 150px;
  height: 30px;
  background-color: #4caf50;
  color: #fff;
  border: 1px solid grey;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 18px;
}

#find-player:hover {
  background-color: #45a049;
}

#futureDate {
  width: 200px; 
  height: 27px; 
  border: 1px solid grey; 
  border-radius: 4px; 
}

.select-level{

  width: 210px; 
  height: 29px; 
  border: 1px solid grey; 
  border-radius: 4px; 

}

.form-class{
  display: flex;
  justify-content: space-evenly;
  background: linear-gradient(to right, #204d80, #11556d);
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.3);
  padding: 20px;
  color: whitesmoke;

}

.custom-select {
  display: flex;
  flex-direction: column;
}

.js-example-basic-single {
  width: 200px; 
  height: 200px;
}

body {
    font-family: 'Montserrat', sans-serif;
    margin: 0;
    padding: 0;
}

header {

    color: #fff;
    
}



@keyframes backgroundGrowth {
    0% {
        background-size: 100% 250%;
    }

    50% {
        background-size: 105% 255%;
    }

    100% {
        background-size: 100% 250%;
    }
}

.description-section {
    background: url('../assets/img1.jpg') center/cover no-repeat;
    text-align: center;
    padding: 140px 0px;
    background-size: 100% 350%;
    background-position: center;
    animation: backgroundGrowth 10s infinite;
}



.description-content {
    max-width: 600px;
    margin: 0 auto;
}

.container {
    max-width: 1260px;
    margin: 20px auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(20, 9, 9, 0.4);
}

.search-bar {
    display: flex;
    margin-bottom: 20px;
}

.search-bar input {
    flex: 1;
    padding: 10px;
}

.search-bar button {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
}

.search-bar button:hover {
    background-color: #45a049;
}

.filters {
    display: flex;
    justify-content: space-between;
}

.filters label {
    margin-right: 10px;
}

.filters select {
    padding: 10px;
    flex: 1;
}

.featured-posts {
    display: flex;
    flex-wrap: wrap;
}

</style>


