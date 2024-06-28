export async function checkLoggedIn(){

      const token = localStorage.getItem('token')

      if (token){

        try {
        // Make a request to the backend to verify the token using fetch
        const response = await fetch(`http://127.0.0.1:8000/verify?token=${token}`);

        if (!response.ok) {
          console.log("failed to id")
          return false
        }

        // Parse the JSON response
        const data = await response.json();
        const id =data['id'];
        // console.log(id)
        return id;
    } catch (error) {
        console.log(error)
        return false
    }
      }

      return false
    }