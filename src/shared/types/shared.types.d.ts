export interface ITemplateEmailOtp {
  title: string;
  body: string;
  recipient: string;
}

export interface ITemplateLinking {
  student_name: string;
  school_name: string;
  student_class: string;
  link: string;
  reject_link: string;
  accept_link: string;
  recipient: string;
  guardian_name: string;
}
