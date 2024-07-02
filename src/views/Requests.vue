<template>
  <div class="nav">
    <NavBar :loggedIn="'true'"   />
  </div>

  <body v-if="authorized">
    <h2 class="title-container">Match Requests</h2>
    <div v-if="votes.length === 0">You have no requests yet.</div>
    <ul v-else>
      <li v-for="vote in votes" :key="vote.id">

        <div class="player-info">
          <div class="player-image">
            <img v-if="vote.photo" :src="`http://localhost:8000/static/images/${vote.photo}`" alt="Player Image" />
            <img v-else-if="vote.gender === 'male'" src="../assets/default-profile-male.png" alt="Default Male Profile Image" />
            <img v-else-if="vote.gender === 'female'" src="../assets/default-female-profile-image.gif" alt="Default Female Profile Image" />
          </div>
          
          <div class="player-name">{{vote.name + ' ' + vote.family_name}}</div>
          <div class="name-line"></div>
        </div>
        <p>Email: {{ vote.email }}</p>
        <p>Age :  {{ calculateAge(vote.date_of_birth) }}</p>
        <div class="vote-actions">
          <button v-if="!showSuccess" @click="acceptRequest(vote.id)">Accept</button>
          
          <button class="secondary" @click="deleteRequest(vote.id)">Refuse</button>
        </div>
        <p class="matchFixed" v-if="showSuccess">Congratulations! You have accepted the match request from {{vote.name}}.<br>  
          You can still decline the proposition by pressing the Refuse Button</p>
        <hr />
      </li>
    </ul>
  </body>

  <body v-if="authorized===false">

    <h1>Access Denied</h1>

    <p class="no-permission">
          Sorry, you do not have the necessary permissions to access this page.
    </p>

    
  </body>

</template>

<script>
import NavBar from '../components/NavBar.vue'

export default {

    components:{
        NavBar,
    },

    data() {
    return {
      votes: [], 
      showSuccess: false,
      authorized : ''
    };
    },

    mounted(){
    this.fetchVotes();
    this.fetch_accepted()
    },

    methods:{
      async fetchVotes() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/votes/${this.$route.params.postId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        if (response.status===200){
          this.votes = data;
          this.authorized=true
        }
        if (response.status===401){
          this.authorized=false
          throw new Error('Not authorized');
        }

        if (response.status===404){
          this.authorized=false
          throw new Error('Post Not Found');
        }
        
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    },

    async fetch_accepted(){

      try {
        const response = await fetch(`http://127.0.0.1:8000/posts/${this.$route.params.postId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        this.showSuccess = data.accepted.includes(true)
        
      } catch (error) {
        console.error('Error fetching votes:', error);
      }


    },

    async deleteRequest(user_id) {

      const post_id = this.$route.params.postId; 

      try {
        const response = await fetch(`http://127.0.0.1:8000/votes/deleted?user_id=${user_id}&post_id=${post_id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          console.log('Vote deleted successfully');
        } else {
          console.error('Failed to delete vote');
        }
      } catch (error) {
        console.error('Error deleting vote:', error);
      }

      window.location.reload();
    },

    async acceptRequest(user_id) {

      const post_id = this.$route.params.postId; 

      try {
        const response = await fetch(`http://127.0.0.1:8000/votes/accepted?user_id=${user_id}&post_id=${post_id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          console.log('Others Requests deleted successfully');
        } else {
          console.error('Failed ');
        }
      } catch (error) {
        console.error('Error deleting vote:', error);
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/votes/accepted?user_id=${user_id}&post_id=${post_id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          console.log('Accepted request');
        } else {
          console.error('Accepting request Failed ');
        }
      } catch (error) {
        console.error('Error deleting vote:', error);
      }

      window.location.reload();
    },

    calculateAge(dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      // Check if the birthday has occurred this year
      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        return age - 1;
      } else {
        return age;
      }
    }


    }


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

.title-container{
  color: #333; 
  font-size: 24px; 
  font-weight: bold;
  text-align: left; 
  margin: 20px 0; 
  font-family: 'Helvetica', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
}

ul {
  list-style-type: none;
}

hr {
    width: 25%; 
    margin-left: 5px;
    margin-bottom: 20px;
    margin-top: 20px;
    border: none;
    height: 1px;
    background-color: #ddd; 
}



.player-info {
        display: flex;
        align-items: center;
        position: relative;
      }

.player-name {
    font-size: 18px;
    font-weight: bold;
    color: #1e0769dd; 

}

.player-image {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); 
      }

      .player-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

.vote-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.vote-details {
  flex-grow: 1;
}

.vote-actions {
  display: flex;
  justify-content: flex-start;
}

button {
  margin-left: 10px;
}

button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #fff;
    background-color: #4caf50; 
}

button.secondary {
    background-color: #f44336; 
}

button:hover {
    background-color: #45a049; 
}

button.secondary:hover {
    background-color: #d32f2f; 
}

.matchFixed{
  border: none;
  border-radius: 4px;
  color: #2911b1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  font-size: 16px; 
  opacity: 0; 
  animation: fadeIn 1s ease-out forwards; 
}

@keyframes fadeIn {
  from {
    opacity: 0; 
  }
  to {
    opacity: 1; 
  }
}

h1 {
  color: #f00; 
  font-weight: bold;
  text-align: left; 
  margin: 20px 0; 
  font-family: 'Helvetica', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
}

.no-permission{
  border: none;
  border-radius: 4px;
  color: #b1112c;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
  font-size: 20px; 
  opacity: 0; 
  animation: fadeIn 1s ease-out forwards; 

}

</style>