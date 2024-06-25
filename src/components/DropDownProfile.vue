<template>
  <div>
    <div v-if="isDropdownOpen" class="dropdown-content">
      <p @click="viewProfile" class="dropdown-option">View Profile</p>
      <p @click="editProfile" class="dropdown-option">Edit Profile</p>
      <p @click="logout" class="dropdown-option">Log Out</p>
    </div>
  </div>
</template>

<script>
export default {


    props: ['isDropdownOpen',],

    methods:{
        
        viewProfile() {
            console.log('View Profile clicked');
            alert('Feature Comming Soon')
        },
        editProfile() {
            console.log('Edit Profile clicked');
            this.$router.push({name:"edit"})

        },
        logout() {
            console.log('Log Out clicked');
            localStorage.removeItem('token');
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userID');
            this.$emit('loggedout','false')
            this.$router.push({name:"home"})
            if (this.$route.name==='home'){
              window.location.reload();

            }
        },
    },
}
</script>



<style scoped> 

.dropdown-content {
  position: absolute;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgb(0, 0, 0);
  margin-top: 20px;
  margin-left: 30px;
  z-index: 2000;
  background-color: #11556d
}

.profile-dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-option {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #e0e0e04d;

}  
</style>