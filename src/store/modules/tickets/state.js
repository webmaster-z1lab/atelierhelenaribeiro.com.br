export default {
    ticket: {
        id: null,
        name: '',
        free_ticket: false,
        is_locked: false,
        summary: '',
        starts_at: '',
        quant_min: 1,
        quant_max: 5,
        lots: [
            {
                amount: '',
                finishes_at: '',
                value: 0,
                status: 'open'
            }
        ]
    },
    coupons:[],
    coupon: {
        id: null,
        is_locked: false,
        entrance_id: '',
        tag: '',
        is_percentage: false,
        validate_at: '',
        code: '',
        discount: 0,
        reuse: 1
    }
}
