export const notificationsLinks = (code: string) => {
    console.log(code)
    if (code.includes("LeaveRequest")) {
        return "LeaveRequests"
    }else if(code.includes("ShiftSchedule")){
        return "Shift"
    }else if(code.includes("Payslip")){
        return "Payslip"
    }
    else {
        return "Home"
    }
}