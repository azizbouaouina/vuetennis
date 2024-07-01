<template>
    <div>
        <div @click="closeLoginForm" id="overlay"></div>

    
        <div id="signup-box">
            <button class="close-button" @click="closeLoginForm">&times;</button>
            <div>
                <h2 class="signup-message">Game on! 🎾 </h2>
                <h2 class="signup-message">Log in to Tennis Mate</h2>
            </div>
            

            <form @submit.prevent="login">
              <input type="email" placeholder="Email" required class="input-login"  v-model="email" />
              <input type="password" placeholder="Password" required class="input-login" v-model="password" />
              <button type="submit" class="button-login">Log In</button>
            </form>
            <div v-if="invalidCred" id="invalid_cred">Invalid Credentials !</div>
            <div class="signup-link">
              Don't have an account? <a href="#" @click="OpenSignForm">Sign Up</a>
            </div>
            
        </div>

    </div>

</template>

<script>

export default {
    data(){
        return{
            email : '',
            password :'',
            invalidCred:false,
        }

    },

    methods:{

        async login(){
            const data = {
            username : this.email,
            password : this.password
            };

            const url ='http://127.0.0.1:8000/login';
            const headers={"Content-Type":"application/x-www-form-urlencoded"}

            try{
            let response = await fetch(url,{
                method:'POST',
                headers:headers,
                body:new URLSearchParams(data)
            })
            let res =await response.json()
            let status = await response.status
            console.log(res)
            
            if (status === 200){
                localStorage.setItem('token',res.access_token)
                this.invalidCred=false
                this.closeLoginForm()
                this.showProfile()
                // console.log("user is is ------------ : ",res.user_id)
                this.$emit('userId',res.user_id)
                this.$store.commit('updateUserId',res.user_id)
                window.location.reload();



            }
            else {
                this.invalidCred=true
            }
            

            }
            catch(err){
            console.error('error : ',err)
            this.invalidCred=true
            }
        },


        OpenSignForm() {
            this.$emit('openSign',false)
        },

        closeLoginForm() {
            this.$emit('closeLogin',false)
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
        background-color: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        z-index: 999;
        width: 400px;
        height: 541px;
        border-radius: 5px;
        /* display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center; */
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
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

  .input-login {
        width: 100%;
        padding: 12px;
        margin-bottom: 10px;
        border: 1px solid #3498db;
        border-radius: 6px;
        box-sizing: border-box;
        font-size: 14px;
      }

      .button-login {
        width: 40%;
        padding: 10px;
        background: #3498db;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        display: block;
        margin: 0 auto;
      }

      .button-login:hover {
        background: #2980b9;
      }

        .signup-link {
            margin-top: 15px;
            text-align: center;
            color: #333;
            font-size: 14px;
      }

      .signup-link a {
        color: #2980b9;
        text-decoration: none;
        font-weight: bold;
      }

      #invalid_cred {
    color: #e74c3c;
    text-align: center;
    margin-top: 10px;
    }

</style>