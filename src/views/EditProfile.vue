<template>

<div class="nav">
    <NavBar :loggedIn="'true'"   />
  </div>


  <div class="modify">
    <h2>Add or Change Profile Photo</h2>
    <input type="file" ref="fileInput" @change="handleFileChange" />
    <br>
    <button @click="uploadImage">Upload Image</button>
    <br>
    <h2>Comming soon</h2>
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
      userID : localStorage.getItem('userID')
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
        })
        .catch(error => {
          console.error('Error uploading image', error);
          // Handle error, if needed
        });
    },
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
    margin-top: 100px;
    margin-left: 20px;
}
button{
  margin-top:5px;
}

</style>
