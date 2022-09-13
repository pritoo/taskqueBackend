const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });


const LeavesSchema = new mongoose.Schema({
    user_code: {
        type: Number
    },
    leave_type: {
        type: String,
        enum: ['Paid_Leave','Compensatory_Leave','Optional_Leave(Any 2)','Marriage_Leave(7 days for self marriage)','Maternity_Leave(26 weeks)','Paternity_Leave(7 days)'],
        default: 'Paid_Leave'
    },
    choice_holiday: {
        type: String,
        default: null
    },
    from_date: {
        type: Date
    },
    to_date: {
        type: Date
    },
    description: {
        type: String
    },
    mode_of_day: {
        type: String
    },
    mode_of_half_day: {
        type: String,
        enum: ['first_half','second_half'],
        default: null
    },
    handover_des: {
        type: String
    },
    status: {
        type: String,
        enum: ['completed','draft'],
        default: null
    },
    leave_status: {
        type: String,
        enum: ['pending','approved','declined','cancelled'],
        default: 'pending'
    },
    request_for_cancelled: {
        type: String,
        enum: ['yes','no'],
        default: 'no'
    },
    leave_status_updated_by: {
        type: Number,
        default: null
    },
    reason: {
        type: String
    },
    created: {
        type: Date
    },
    modified: {
        type: Date
    }
})

const UserLeaves = new mongoose.model('userleaves', LeavesSchema);

const LeaveCancelNotificationsSchema = new mongoose.Schema({
    user_code: {
        type: Number,
        default: null
    },
    leave_cancel_request_id: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['approved','disapproved','pending'],
        default: 'pending'
    }
})

const UserLeaveCancelNotifications = new mongoose.model('user_leave_cancel_notification',LeaveCancelNotificationsSchema);

const LeaveCancelRequestSchema = new mongoose.Schema({
    leave_id: {
        type: Number,
        default: null
    },
    cancel_date: {
        type: String
    },
    user_code: {
        type: Number,
        default: null
    },
    note: {
        type: String
    },
    approved_by: {
        type: Number,
        default: null
    },
    status: {
        type: String,
        enum: ['approved','disapproved','pending'],
        default: 'pending'
    },
    created: {
        type: Date
    }
})

const UserLeaveCancelRequest = new mongoose.model('user_leave_cancel_request', LeaveCancelRequestSchema)

const LeaveHandoverRequestSchema = new mongoose.Schema({
    user_code: {
        type: Number
    },
    leaved_id: {
        type: Number
    },
    handover_person_id: {
        type: Number
    },
    created: {
        type: Date
    }
})

const UserLeaveHandoverRequest = new mongoose.model('user_leave_handover_request',LeaveHandoverRequestSchema)

const LeaveReportToSchema = new mongoose.Schema({
    leaved_id: {
        type: Number,
        default: null
    },
    report_to: {
        type: Number,
        default: null
    }
})

const UserLeaveReportTo = new mongoose.model('user_leave_report_to',LeaveReportToSchema);
module.exports = UserLeaves
//module.exports = { UserLeaves,UserLeaveCancelNotifications,UserLeaveCancelRequest,UserLeaveHandoverRequest,UserLeaveReportTo};