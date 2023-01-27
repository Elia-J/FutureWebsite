import { supabaseAdmin } from "/lib/supasbaseClient.js"

export default async function DeleteUserAccount(req, res) {


    const supabase = supabaseAdmin()

    //get the asscess token from the request
    const { access_token } = req.body

    //get the user id from the access_token and supabase
    const { data: { user }, error: error1 } = await supabase.auth.getUser(
        access_token
    )
    if (error1) {
        res.status(500).send({
            message: "Error getting user, you are not allowed to be here " + error1,
        })
    }
    const user_id = user.id



    //############################################################ Delete the user data from the database - start #################
    //Delete the user from the todos table
    const { data: data5, error: error5 } = await supabase
        .from('todos')
        .delete()
        .eq('user_id', user_id)
    if (error5) {
        res.status(500).send({
            message: "Error deleting user from todos table " + error5
        })
    }

    //Delete the user from the notesv2 table
    const { data: data4, error: error4 } = await supabase
        .from('notesv2')
        .delete()
        .eq('user_id', user_id)
    if (error4) {
        res.status(500).send({
            message: "Error deleting user from notesv2 table " + error4
        })
    }

    //delete the user from the folders table
    const { data: data6, error: error6 } = await supabase
        .from('folders')
        .delete()
        .eq('user_id', user_id)
    if (error6) {
        res.status(500).send({
            message: "Error deleting user from folders table " + error6
        })
    }

    //delete the user from the todosFolders table
    const { data: data7, error: error7 } = await supabase
        .from('todosFolders')
        .delete()
        .eq('user_id', user_id)
    if (error7) {
        res.status(500).send({
            message: "Error deleting user from todosFolders table " + error7
        })
    }

    //Delete the user from the profiles table
    const { data: data3, error: error3 } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user_id)
    if (error3) {
        res.status(500).send({
            message: "Error deleting user from profiles table " + error3
        })
    }

    //############################################################ Delete the user data from the database - end #################


    //Delete the user from the supabase auth table
    const { data: data2, error: error2 } = await supabase.auth.admin.deleteUser(
        user_id
    )
    if (error2) {
        res.status(500).send({
            message: "Error deleting user " + error2
        })
    }


    res.status(200).send({
        message: "User deleted"
    })


}


