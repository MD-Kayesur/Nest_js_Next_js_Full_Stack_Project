//custom throttl config
import { Throttle } from "@nestjs/throttler"

//strict rate for auth ,payment
export const StrictThrottler = () => Throttle({
    default:{
        ttl:1000,
        limit:5
    }
})

//modarate rate for orders
export const ModerateThrottler = () => Throttle({
    default:{
        ttl:1000,
        limit:5
    }
})

//relaxed rate for read operations
export const RelaxedThrottler = () => Throttle({
    default:{
        ttl:1000,
        limit:5
    }
})