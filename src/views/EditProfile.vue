<template>

<div class="nav">
    <NavBar :loggedIn="'true'"   />
  </div>

<div class="modify">


  <div >
    <h2 class="title-container" v-if="userData.photo">Change Profile Photo</h2>
    <h2 class="title-container" v-else>Add Profile Photo </h2>
    <input type="file" ref="fileInput" @change="handleFileChange" />
    <br>
    <button @click="uploadImage">Upload Image</button>
    <br>
  </div>

  <div class="player-image">
    <img img v-if="userData.photo" :src="`http://localhost:8000/static/images/${userData.photo}`" alt="Player Image" />
    <img v-else-if="userData.gender === 'male'" src="../assets/default-profile-male.png" alt="Default Male Profile Image" />
    <img v-else-if="userData.gender === 'female'" src="../assets/default-female-profile-image.gif" alt="Default Female Profile Image" />
  </div>


  

    <div class="update-form">
      <label for="name">Name:</label>
      <input v-model="userData.name" type="text" id="name" required />

      <label for="familyName">Family Name:</label>
      <input v-model="userData.family_name" type="text" id="familyName"  required/>

      <label for="dob">Date of Birth:</label>
      <input type="date" id="dob" v-model="userData.date_of_birth" :max="getCurrentDate()" required />

      <label for="gender">Gender:</label>
      <select v-model="userData.gender" id="gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>


      <label for="phone">Phone Number:</label>
      <input v-model="userData.phone_numer" type="text" id="phone" />

      <button @click="updateUser">Update Profile</button>
      <br>
    </div>
    </div>

</template>

<script>
import NavBar from '../components/NavBar.vue'

export default {

  components:{
        NavBar,
    },

  data() {
    return {
      file: null,
      userID : localStorage.getItem('userID'),
      userData: {
        name: "",
        family_name: "",
        gender: "",
        phone_numer: "",
        date_of_birth:"",
        photo:""
      },
    };
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    uploadImage() {
      if (!this.file) {
        alert('Please select a file');
        return;
      }

      const formData = new FormData();
      formData.append('file', this.file);


      fetch(`http://localhost:8000/users/${this.userID}/upload/`, {
        method: 'PUT',
        body: formData,
        headers: {
          // Add any additional headers as needed
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log('Image uploaded successfully', data);
          // Handle success, if needed
          window.location.reload();
        })
        .catch(error => {
          console.error('Error uploading image', error);
          // Handle error, if needed
        });
    },
    async getUser() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/${localStorage.getItem('userID')}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          // Handle error, for example:
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        this.userData.date_of_birth=data.date_of_birth
        this.userData.family_name=data.family_name
        this.userData.name=data.name
        this.userData.gender=data.gender
        this.userData.phone_numer=data.phone_numer
        this.userData.photo=data.photo
        console.log('User data:', data);
        // Handle the data as needed
      } catch (error) {
        console.error('Error fetching user:', error);
        // Handle the error
      }
    },

    async updateUser() {
      try {

        const response = await fetch(`http://127.0.0.1:8000/users/${localStorage.getItem('userID')}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(this.userData),
        });

        if (!response.ok) {
          // Handle error, for example:
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const updatedUserData = await response.json();
        console.log('Updated user data:', updatedUserData);
        window.location.reload();
        // Handle the updated data as needed
      } catch (error) {
        console.error('Error updating user:', error);
        // Handle the error
      }
    },

    getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zero if month or day is a single digit
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}-${month}-${day}`;
    },

  },

  mounted(){
    this.getUser()
  },

};
</script>

<style scoped>

.nav{
  position: fixed;
  top: 0;
  left: 0;
  color: white;  
}

.modify{
  display: flex;
    margin-top: 100px;
    margin-left: 20px;

  align-items: center;
  justify-content: center;
}
button{
  margin-top:5px;
}


.player-image {
        width: 150px;
        height: 150px;
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

.title-container{
  color: #333; 
  font-size: 24px; 
  font-weight: bold;
  text-align: left; 
  margin: 20px 0; 
  font-family: 'Helvetica', Arial, sans-serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); 
}


.profile-update {
  
  margin: 0 auto;
  padding: 20px;
}

.update-form {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  max-width: 500px;
  margin-left: 20px;
  
}

label {
  margin-bottom: 8px;
}

input,
select {
  margin-bottom: 15px;
  padding: 8px;
  font-size: 16px;
}

button {
  padding: 10px 15px;
  background-color: #3498db;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #2980b9;
}


</style>
