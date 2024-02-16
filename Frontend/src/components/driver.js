import { driver } from 'driver.js'
import "../../node_modules/driver.js/dist/driver.css"
import "../driverjs.css"


const driverObj = driver({
    showProgress: true,
    popoverClass: 'driverjs-theme',
    steps: [
        { element: '.tweet', popover: { title: 'Sample tweet', description: 'Here is a sample tweet of a user.', side: "bottom", align: 'start' } },
        { element: '.heart-button', popover: { title: 'Like a tweet', description: 'You can like a tweet here.', side: "bottom", align: 'start' } },
        { element: '#reply', popover: { title: 'Reply to a tweet', description: 'You can reply to a tweet here.', side: "bottom", align: 'start' } },
        { popover: { title: 'Login to explore more', description: 'You need to login to use all this functionalities.' } }
    ]
});

export default driverObj;