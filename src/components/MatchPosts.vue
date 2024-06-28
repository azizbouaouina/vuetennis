<template>


<body>
    <div class="post">
      <div class="player-info">
        <div class="player-image">
          <img img v-if="imageProfil" :src="`http://localhost:8000/static/images/${imageProfil}`" alt="Player Image" />
          <img v-else-if="gender === 'male'" src="../assets/default-profile-male.png" alt="Default Male Profile Image" />
          <img v-else-if="gender === 'female'" src="../assets/default-female-profile-image.gif" alt="Default Female Profile Image" />

        </div>
        <div class="player-name">{{name + ' ' + familyName}}</div> 
        <div class="name-line"></div>
      </div>

      <div class="info-section">
        <p v-if="!expired"><strong>Date and Time:</strong> {{formatDate(date)}}</p>
        <p v-if="expired" style="" class="date-title-expired"><strong>Date and Time: </strong> </p><p v-if="expired" class="expired"> {{formatDate(date)}} : <strong>Expired</strong></p>
        
        <p><strong>Level of Play:</strong> {{level}}</p>
        <p><strong>City:</strong> {{city}}</p>
        <p><strong>Address:</strong> {{address}}</p>
      </div>

      <div class="info-section">
        <p>
          <strong>Description:</strong><br />
          {{description}}
        </p>
      </div>



      <div v-if="userId != postUserID" >

        <div v-if="isMatchRequested && check_accepted()" class="buttons-1">
          <div style="display:flex;justify-content: center;">
              <button class="button accept-match" >Request Accepted !</button>  
          </div>
          
          <div class="buttons-2">
            <button class="button remove-match" @click="deleteRequest">Remove Request</button>
          <button class="button message-player" @click="messagePlayer">Message the Player</button>

          </div>
          
        </div>

        <div v-else-if="!isMatchRequested && check_accepted()" class="buttons">
          <button class="button match-set" >Match already set</button>
        </div>

        <div v-else-if="isMatchRequested" class="buttons">
          <button class="button remove-match" @click="deleteRequest">Remove Request</button>
          <button class="button message-player" @click="messagePlayer">Message the Player</button>
        </div>
        <div v-else class="buttons">
          <button class="button request-match" @click="requestaMatch">Request a Match</button>
          <button class="button message-player" @click="messagePlayer">Message the Player</button>
        </div>
         
        
      </div>

      <div v-if="userId  == postUserID" class="buttons"> 
        <button class="button-request-see request-see" @click="seeRequests" >See Match Requests : {{numberRequests}}</button>
      </div>

    </div>
  </body>
 
</template>

<script>

import { checkLoggedIn } from '../utils';


export default {
  name: 'MatchPosts',

  data(){
    return{

      userId: null,
      isMatchRequested: null,

    };
  },

  

  props:['date','level','city','address','description','name','familyName',
  'imageProfil','postUserID','postID','requesterIds','gender','accepted','numberRequests'],

  computed:{
        
        expired: function() {
        return !this.isFutureDate(this.date);
      },
    },

  async created() {
    // Fetch userId and isMatchRequested asynchronously when the component is created
    this.userId = await this.getUserId();
    this.isMatchRequested = await this.checkUserRequestedMatch();
  },

  methods:{

    async getUserId() {
    return await checkLoggedIn(); 
  },


  formatDate(inputDate) {
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  const dateObj = new Date(inputDate);
  const year = dateObj.getFullYear();
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const formattedDate = `${month} ${day}, ${year} - ${hours}:${minutes < 10 ? '0' : ''}${minutes} `;

  return formattedDate;
},

isFutureDate(inputDate) {
  const dateObj = new Date(inputDate);

  const now = new Date();

  if (dateObj > now) {
    return true;
  } else {
    return false;
  }
},

async submitRequest() {
    const url = 'http://127.0.0.1:8000/votes/';
    const data = {
      post_id: this.postID,
      dir: 1
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Handle success
        console.log('Vote submitted successfully');
      } else {
        // Handle error
        console.error('Failed to submit vote');
      }
    } catch (error) {
      console.error('An error occurred while submitting vote', error);
    }
  },

  


async requestaMatch() {
  try {
    const isLoggedIn = await checkLoggedIn();

    if (isLoggedIn) {
      this.submitRequest();
      window.location.reload();
    } else {
      alert('You need to log in first');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
    // Handle error as appropriate
  }
},


async deleteRequest(){
  const url = 'http://127.0.0.1:8000/votes/';
    const data = {
      post_id: this.postID,
      dir: 0
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Handle success
        console.log('Vote submitted successfully');
      } else {
        // Handle error
        console.error('Failed to submit vote');
      }
    } catch (error) {
      console.error('An error occurred while submitting vote', error);
    }

    window.location.reload();


},

async messagePlayer() {
  try {
    const isLoggedIn = await checkLoggedIn();

    if (isLoggedIn) {
      alert('Feature Comming Soon');
    } else {
      alert('You need to log in first');
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
},

async checkUserRequestedMatch(){

  const userID = await checkLoggedIn();
  const userIDInt = parseInt(userID, 10);

  console.log("user id is : ",userID)
  console.log('array : ',this.requesterIds)
  console.log(this.requesterIds.includes(userIDInt))
  if (userID ){
    return this.requesterIds.includes(userIDInt);
  }
  else {
    return false
  }
},

check_accepted(){
  return this.accepted.includes(true)
},

seeRequests(){

  this.$router.push({
  name: 'request',
  params: {
    postId: this.postID
  }
});

},

},
  
}
</script>

<style scoped>
      .post {
        color: #555;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        border: 2px solid #ddd;
        padding: 15px;
        border-radius: 8px;
        box-sizing: border-box;
        margin: 10px;
        width: 400px;
        height: 450px;
        background-color: #f4f4f49e;
        position: relative;
      }

      .player-info {
        display: flex;
        align-items: center;
        position: relative;
      }

      .player-image {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Subtle box-shadow */
      }

      .player-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .player-name {
        font-weight: bold;
        font-size: 1.3em;
        color: #3498db;
        position: relative;
      }

      .name-line {
        position: absolute;
        bottom: 0;
        top: 70%;
        left: 22%;
        width: calc(100% - 30%);
        height: 1px;
        background-color: #bdc3c7;
      }

      .info-section {
        margin: 10px 0;
        word-wrap: break-word;
      }

      .info-section p {
        font-size: 1em;
        margin: 8px 0;
      }


      .expired {
        color: rgba(211, 31, 31, 0.8);
    font-size: 1em;
    /* margin: 8px 0; */
    display: inline;
  }

  .date-title-expired{
    display: inline;
  }


      .buttons {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        /* justify-content: center; */
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);
      }

      .buttons-2{
        display: flex;
        gap: 10px;
        /* margin-top: 15px; */
        /* justify-content: center; */
        /* position: absolute; */
        /* bottom: 13px; */
        /* left: 50%; */
        /* transform: translateX(-50%); */

      }

      .buttons-1{
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 15px;
        position: absolute;
        bottom: 13px;
        left: 50%;
        transform: translateX(-50%);

      }

      .button {
        height: 35px;
        width: 158px;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
      }

      .request-match {
        background-color: #27ae60;
        color: white;
      }

      .request-match:hover {
        background-color: #218e4e;
      }

      .remove-match{
        background-color: #ae2727;
        color: white;

      }
      .remove-match:hover {
        background-color: #8e2121;
      }

      .accept-match{
        background-color: #272bae;
        color: white;
        cursor: auto;

      }

      .match-set{
        background-color: #272bae;
        color: white;
        cursor: auto;

      }

      .message-player {
        background-color: #2980b9;
        color: white;
      }

      .message-player:hover {
        background-color: #236a8b;
      }

      .request-see {
        background-color: #2980b9;
        color: white;
      }

      .request-see:hover {
        background-color: #236a8b;
      }

      .button-request-see {
        height: 35px;
        width: 200px;
        padding: 8px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9em;
      }
    </style>


