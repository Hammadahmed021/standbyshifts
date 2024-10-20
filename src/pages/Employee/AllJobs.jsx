import React, { useEffect } from 'react'
import { getJobsByFilter } from '../../utils/Api'

const AllJobs = () => {
    useEffect(() => {
        const getJobs = async () => {
            const res = await getJobsByFilter();
            console.log(res);
        }
        getJobs()
    }, [])
    return (
        <div>

        </div>
    )
}

export default AllJobs
