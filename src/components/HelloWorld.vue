<template>


<body>
    <div class="post">
      <div class="player-info">
        <div class="player-image">
          <!-- <img src="http://localhost:8000/static/images/"+{{imageProfil}} alt="Player Image" /> -->
          <img :src="`http://localhost:8000/static/images/${imageProfil}`" alt="Player Image" />

        </div>
        <div class="player-name">{{name + ' ' + familyName}}</div>
        <div class="name-line"></div>
      </div>

      <div class="info-section">
        <p v-if="!expired"><strong>Date and Time:</strong> {{formatDate(date)}}</p>
        <p v-if="expired" style="margin-left: 5px;" class="date-title-expired"><strong>Date and Time: </strong> </p><p v-if="expired" class="expired"> {{formatDate(date)}} : <strong>Expired</strong></p>
        
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

      <div class="buttons">
        <button class="button request-match" >Request a Match</button>
        <button class="button message-player">Message the Player</button>
      </div>
    </div>
  </body>
 
</template>

<script>
import { onMounted } from 'vue';

export default {
  name: 'HelloWorld',

  

  props:['date','level','city','address','description','name','familyName','imageProfil'],

  // data(){
  //   return{
  //     expired : this.isFutureDate(this.date)
  //   }
  // },

  computed:{
        
        expired: function() {
        return !this.isFutureDate(this.date);
      },

    },

  methods:{
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
}
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
        height: 390px;
        /* background-color: #f4f4f4; */
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
      }

      .info-section p {
        font-size: 1em;
        margin: 8px 0;
      }


      .expired {
        color: rgba(211, 31, 31, 0.8);
    font-size: 1em;
    margin: 8px 0;
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

      .message-player {
        background-color: #2980b9;
        color: white;
      }

      .message-player:hover {
        background-color: #236a8b;
      }
    </style>


