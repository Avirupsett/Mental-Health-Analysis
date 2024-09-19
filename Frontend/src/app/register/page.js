import { getUser } from '@workos-inc/authkit-nextjs';
import RegisterContextProvider from '../../components/Form/RegisterContextProvider'
import React from 'react'


export default async function Register() {
    const { user } = await getUser();
    

    return (
        <RegisterContextProvider email={user?.email}/>
    )
}
