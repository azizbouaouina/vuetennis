<template>

  <div class="nav">
    <NavBar :loggedIn="'true'"   />
  </div>
    
<body>
  <div class="post">
    <div id="app">
      <form @submit.prevent="handleSubmit">
        <label for="datetime">Date and Time:</label>
        <input
          type="datetime-local"
          id="datetime"
          v-model="post.datetime"
          :min="minDatetime"
          
        />

        <label for="level">Level of Play:</label>
        <select id="level" v-model="post.level" >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <label for="city">City:</label>
        <select id="city" v-model="post.city">
          <option v-for="city in cities" :value="city" :key="city">{{ city }}</option>
        </select>

        <label for="address">Address:</label>
        <input type="text" id="address" class="address" v-model="post.address" @input="updateCharacterCountAdress"  />
        <p>{{ characterCountAdress }} characters left</p>

        <label for="description">Description:</label>
        <textarea class="description"
          id="description"
          v-model="post.description"
          @input="updateCharacterCount"
          
        ></textarea>
        <p>{{ characterCount }} characters left</p>

        <button type="submit">Create Post</button>
      </form>
    </div>
  </div>
</body>
  


  
    

  
</template>

<script>
import NavBar from '../components/NavBar.vue'

export default {
    components:{
        NavBar,
    },

      mounted() {
    // Initialize Select2 after the component is mounted
    $('.js-example-basic-single').select2({placeholder: 'Select or Type a city'});},
    

    data(){
      return{
        post: {
            datetime: "",
            level: "",
            city:"",
            address: "",
            description: "",
          },
        maxCharacterCount: 150,
        characterCount: 150,

        maxCharacterCountAdress: 40,
        characterCountAdress: 40,

        datetime: this.getCurrentDatetime(),

        cities: require('../assets/commune_data.json').Commune,

      }
    },

    computed: {
    minDatetime() {
      return this.getCurrentDatetime(); // Set the minimum allowed date and time
    },
  },

      methods: {
    updateCharacterCount() {
      this.characterCount = this.maxCharacterCount - this.post.description.length;
      if (this.characterCount < 0) {
        this.post.description = this.post.description.slice(0, this.maxCharacterCount);
        this.characterCount = 0;
      }
    },

    updateCharacterCountAdress() {
      this.characterCountAdress = this.maxCharacterCountAdress - this.post.address.length;
      if (this.characterCountAdress < 0) {
        this.post.address = this.post.address.slice(0, this.maxCharacterCountAdress);
        this.characterCountAdress = 0;
      }
    },


async handleSubmit() {
      try {
        const response = await fetch('http://127.0.0.1:8000/posts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,

          },
          body: JSON.stringify(this.post),
        });

        if (response.ok) {
          alert('Data submitted successfully!');
          this.$router.push({name:"home"})
        } else {
          console.error('Failed to submit data:', response.statusText);
          alert('Failed to submit data.');
        }
      } catch (error) {
        console.error('Error submitting data:', error);
        alert('Failed to submit data.');
      }
    },
    getCurrentDatetime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
  },


}
</script>

<style scoped>

body {
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.nav{
  position: fixed;
  top: 0;
  left: 0;
  color: white;  
}

.post{
  margin-top: 100px;
}


#app {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input,
select,
textarea{
  margin-bottom: 15px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

.js-example-basic-single {

  width: 100%;
}

.select-city{
    margin-bottom: 15px;
}

.description{
  height: 65px;
  margin-bottom: 5px;
}

.address{
  margin-bottom: 5px;

}

button {
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

p{
  margin-top : 0;
  padding-top: 0;
  font-size: 12px;
  color: #555;
  font-size: 12px;
  text-align: right;
  
}

</style>