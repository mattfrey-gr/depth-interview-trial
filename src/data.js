const DOCTORS_URL = 'https://api.github.com/repos/mattfrey-gr/depth-interview/contents/doctors.json';
const DOCTORS_INSURANCE_URL = 'https://api.github.com/repos/mattfrey-gr/depth-interview/contents/doctor_insurance.json';
const INSURANCE_URL = 'https://api.github.com/repos/mattfrey-gr/depth-interview/contents/insurance.json';


const getFileContents = async url => {
  const data = await (await fetch(url)).json();
  return JSON.parse(window.atob(data.content));
};

const getDoctorInsuranceMapping = async () => {
  const contents = await getFileContents(DOCTORS_INSURANCE_URL);
  return contents.insurance_x_doctors;
};

const getDoctors = async () => {
  const contents = await getFileContents(DOCTORS_URL);
  const doctorList = contents.doctors_list;
  return Object.fromEntries(doctorList.map(d => [d.doctor_id, d]));
};

const getInsurance = async () => {
  const contents = await getFileContents(INSURANCE_URL);
  const insuranceList = contents.insurance_list;
  return Object.fromEntries(insuranceList.map(i => [i.id, i]));
};

export const allData = async () => {
  const doctors = await getDoctors();
  const doctorInsuranceMapping = await getDoctorInsuranceMapping();
  const insurance = await getInsurance();

  doctorInsuranceMapping.forEach(x => {
    const doctor = doctors[x.doctor_id];
    const insurancePlan = insurance[x.insurance_id];

    if (doctor.insurances) {
      doctor.insuranceList.push(insurancePlan);
    }
    else {
      doctor.insuranceList = [insurancePlan];
    }

    if (insurancePlan.doctors) {
      insurancePlan.doctors.push(doctor);
    }
    else {
      insurancePlan.doctors = [doctor];
    }
  });

  return {
    doctors,
    insurance,
  };
};