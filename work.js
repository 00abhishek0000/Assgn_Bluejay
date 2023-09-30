const XLSX = require('xlsx');

const workbook = XLSX.readFile('Assignment_Timecard.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(worksheet);

const employeesWith7ConsecutiveDays = [];
const employeesWithLessThan10HoursBetweenShifts = [];
const employeesWithMoreThan14HoursInSingleShift = [];

for(let i = 1;i<data.length;i++){
    const record = data[i];
  
    const positionStatus = record['Position Status'];
    const timeIn = record['Time'];
    const timeOut = record['Time Out'];
    const timecardHours = record['Timecard Hours (as Time)'];
    const payCycleStartDate = record['Pay Cycle Start Date'];
    const payCycleEndDate = record['Pay Cycle End Date'];
    const employeeName = record['Employee Name'];
  
    if (checkFor7ConsecutiveDays(data, i, payCycleStartDate)) {
      employeesWith7ConsecutiveDays.push({ employeeName, positionStatus });
    }
  
    if (checkForLessThan10HoursBetweenShifts(data, i, timeIn)) {
      employeesWithLessThan10HoursBetweenShifts.push({ employeeName, positionStatus });
    }
  
    if (parseFloat(timecardHours) > 14) {
      employeesWithMoreThan14HoursInSingleShift.push({ employeeName, positionStatus });
    }
  }
  
  console.log("Employees who have worked for 7 consecutive days:", employeesWith7ConsecutiveDays);
  console.log("Employees with less than 10 hours between shifts but greater than 1 hour:", employeesWithLessThan10HoursBetweenShifts);
  console.log("Employees who have worked for more than 14 hours in a single shift:", employeesWithMoreThan14HoursInSingleShift);
  
  function checkFor7ConsecutiveDays(data, currentIndex, currentPayCycleStartDate) {
    const daysToCheck = 7;
    for(let i=1;i<=daysToCheck;i++){
      const nextIndex = currentIndex + i;
      if (nextIndex >= data.length) {
        return false;
      }
      const nextPayCycleStartDate = data[nextIndex]['Pay Cycle Start Date'];
      if (nextPayCycleStartDate !== currentPayCycleStartDate + i) {
        return false;
      }
    }
    return true;
  }
  
  function checkForLessThan10HoursBetweenShifts(data, currentIndex, currentTimeIn) {
    const maxHoursBetweenShifts = 10;
    const minHoursBetweenShifts = 1;
    for (let i = 1; i < currentIndex; i++) {
      const previousTimeOut = data[currentIndex - i]['Time Out'];
      const timeDifference = (currentTimeIn - previousTimeOut) * 24;
      if (timeDifference < maxHoursBetweenShifts && timeDifference > minHoursBetweenShifts) {
        return true;
      }
    }
    return false;
  }