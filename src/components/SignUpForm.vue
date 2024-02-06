<template>
    <div>
        <div @click="changePopUpSignUptoFalse" id="overlay"></div>

    
        <div id="signup-box">
            <button class="close-button" @click="changePopUpSignUptoFalse">&times;</button>

            <h2 class="signup-message">Game on! 🎾 </h2>
            <h2 class="signup-message">Join Tennis Mate today</h2>


            <form @submit.prevent="signin">
                <label class="label-signup" id="first-label" for="name">Name:</label>
                <input class="input-signup" type="text" id="name" v-model="name" required />

                <label class="label-signup" for="familyName">Family Name:</label>
                <input class="input-signup" type="text" id="familyName" v-model="family_name" required />

                <label class="label-signup" for="email">Email:</label>
                <input class="input-signup" type="email" id="email" v-model="email" required />

                <div v-if="emailUsed" id="email-used">Email already in use. Please choose another.</div>

                <label class="label-signup" for="password">Password:</label>
                <input class="input-signup" type="password" id="password" v-model="password" required />

                <label class="label-signup" for="dob">Date of Birth:</label>
                <input class="input-signup" type="date" id="dob" v-model="date_of_birth" required />

                <label class="label-signup" for="gender">Gender:</label>
                <select id="gender"  v-model="user_gender" required>
                <option value="male">Male</option>
                <option value="female">Female</option>
                </select>
                <div>
                    <button class="button-signup">Sign Up</button>
                </div>
            </form>
            
        </div>

    </div>

</template>

<script>

export default {
    data(){
        return{
            email:'',
            password:'',
            emailUsed:false,
            user_gender:'',
            date_of_birth:'',
            family_name:'',
            name:'',
        }

    },

    computed:{

        dateFormatted: function() {
        return new Date(this.date_of_birth).toISOString().split('T')[0];
      },

    },


    methods:{

        async signin() {
            const data = {
                    email: this.email,
                    password: this.password,
                    name: this.name,
                    family_name:this.family_name ,
                    date_of_birth:this.dateFormatted ,
                    gender: this.user_gender
                    
                    };
            const url = 'http://127.0.0.1:8000/users/';
            const headers = {
                    "accept": "application/json",
                    "Content-Type": "application/json",
                };

            try{
                let response = await fetch(url, {
                method: "POST", 
                headers: headers,
                body: JSON.stringify(data),
                });
                let res = await response.json();
                let status = await response.status;

                if (status === 226){
                    this.emailUsed=true
                }
                else{
                    this.emailUsed=false
                }
                if (status === 201){
                    localStorage.setItem('token',res.access_token)
                    localStorage.setItem('loggedIn',true)
                    this.changePopUpSignUptoFalse()
                    this.showProfile()


                }
                return res; 

            }catch(err){
                console.error('Error:', err); 
                return err
            }
        },

        changePopUpSignUptoFalse() {
            this.$emit('close',false)
        },
        showProfile(){
          this.$emit('showProfileNav','true')

        }
    }

}
</script>

<style scoped>

#overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
      }

    #signup-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        /* background-color: #fff; */
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 999;
        width: 400px;
        height: 551px;
        border-radius: 5px;
        background: linear-gradient(to right, #f5f5f5, #dcdcdc);

      }

    .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    /* background: none; */
    border: 1px solid gray; 
    border-radius: 40%;
    font-size: 20px;
    cursor: pointer;
    /* color: #3498db; */
  }

  .close-button:hover {
    color: #2980b9;
    background-color: #ccc;
  }

  .signup-message {
    text-align: center;
    font-size: 18px; /* Adjust the font size as needed */
    color: #3498db; /* Adjust the color to match your design */
    /* margin-bottom: 20px; */
    line-height: 1.5; /* Adjust the line height for better readability */
    padding: 0px;
    margin: 5px;
  }

  #first-label{
    margin-top: 5px;
  }

    .label-signup {
    display: block;
    margin-bottom: 8px;
    }

    .input-signup {
    width: 100%;
    padding: 8px;
    margin-bottom: 16px;
    box-sizing: border-box;
    border: 1px solid #3498db;
    border-radius: 6px;
    }

    .button-signup {
    /* background-color: #3498db; */
    background-color: #2980b9;
    color: #fff;
    padding: 10px;
    border: none;
    cursor: pointer;
    display: block;
    margin: 0 auto;
    border-radius: 3px;
    }

    .button-signup:hover {
    background: #236a8b;
    }

      #email-used {
    color: #e74c3c;
    text-align: center;
    margin-top: 2px;
    margin-bottom: 10px;
    }

</style>