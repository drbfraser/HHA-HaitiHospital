// _id will be assigned by MongoDB
export interface Department {
  _id?: string;
  name: string;
}

export interface DepartmentJson {
  id: string;
  name: string;
}
