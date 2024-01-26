import axios from 'axios';
import cfg from 'cfg';
var start=-50;
var end=0;
export const getReferrals =async (page) => {
  start=start+50
  end=end+50
   return await axios({
        method: "get",
        url: cfg.baseURL+`/referral_app/referrals-stats/?start=${start}&end=${end}`,
        headers:{
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
    }).then(async response => {
        console.log(response.data)
        let res=[]      
        for await(let i of response.data){
          let temp={
            name:i.user.first_name+' '+i.user.last_name,
            phone:i.user.mobile,
            isEligible:!i.isEligible,
            eligible:i.total_claims+i.remaining_claims,
            claimed:i.total_claims,
            remaining:i.remaining_claims,
            isFulfilled:i.remaining_claims<1,
            claim:[],
            referrals:[],
            refCode:i.referral_code
          }
          for(let j of i.referrals){
            temp.referrals.push({
              name:j.user.first_name+j.user.last_name,
              phone:j.user.mobile,
              price:j.sale_amount,
              date:j.user.created_at&&new Date(j.user.created_at).toDateString()
            })
          }
          for(let k of i.recent_claims){
            temp.claim.push(`Claimed on ${k.user.created_at&&new Date(k.user.created_at).toUTCString()}`)
          }
          res.push(temp)
        }
        return res
    }).catch(err => {
      console.log(err)
        alert("Error Occured while getting referrals")      
    })
}

export const markFulfilled=async(refCode)=>{
     return await axios({
          method: "post",
          url: cfg.baseURL+'/api/mark-as-fulfilled/',
          data:  {
            "referral_code": refCode
          },
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token') || ''
          }
      }).then(response => {
        alert('Marked as Fulfilled')
        return true
      }).catch(err => {
        alert("Error Occured while marking fulfilled")     
        return false     
      })
}

// axios({
//     method: "post",
//     url: '',
//     data: {
//     }
// }).then(response => {
    
// }).catch(err => {
    
// })


/**
 * user referral data:
 *      remaining : (total remaining(total-claimed) count)
 *      claimed : (Total claimed count)
 *      recently added 3 users list:
 *          name,number,total price of all orders, date of referral
 *      recent 3 claims:
 *          orderID, date
 */