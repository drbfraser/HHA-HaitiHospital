import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import SideBar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';
import communityModel from './models/communityModel.json';
import communityModelFr from './models/communityModelFr.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

function CommunityForm() {
  const { register, handleSubmit, reset } = useForm({});
  const [formModel, setFormModel] = useState({});
  const [sectionState, setSectionState] = useState(0);
  const history = useHistory();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const getData = async () => {
      if (i18n.language === 'fr') {
        await setFormModel(communityModelFr);
      } else {
        await setFormModel(communityModel);
      }

      setSectionState(0);
    };

    getData();
  }, [i18n.language]);

  useEffect(() => {
    sidePanelClick(sectionState);
    fixVaccination();
  });

  const sections: any = Object.values(formModel);
  const fields = [];
  for (var i = 0; i < sections.length; i++) {
    for (var j = 0; j < sections[i].section_fields.length; j++) {
      fields.push(sections[i].section_fields[j]);
    }
  }

  const addFormDescriptions = (formFields) => {
    var descriptions = {};
    fields.forEach((field) => {
      if (field.field_type === 'number') {
        let key = field.field_id.replaceAll('.', '_');
        descriptions[key] = field.field_label;
      } else if (field.field_type === 'array') {
        let key = field.field_id.replaceAll('.', '_');
        descriptions[key] = field.field_label;
      } else if (field.field_type === 'list') {
        let key = field.field_id.replaceAll('.', '_');
        descriptions[key] = field.field_label;
        field.field_template.forEach((listField) => {
          var listID = key + '_' + listField.field_id;
          descriptions[listID] = listField.field_label;
        });
      }
    });
    return descriptions;
  };

  const onSubmit = async (data: any) => {
    if (!window.confirm(i18n.t('departmentFormSubmitAlertPressOKToSubmit'))) {
      return;
    }

    if (submitValidation()) {
      var vaccineTable = data['Vaccination'];

      for (let i = 0; i < 18; i++) {
        var totalCounter = 1;
        for (let j = 0; j < 12; j += 3) {
          var totalElement = document.getElementById('tables' + 8 + '-' + i + '-' + (j + 2));
          vaccineTable[fields[7].row_labels[0][i]]['Total ' + totalCounter++] =
            totalElement.innerHTML;
        }

        var totalElement = document.getElementById('tables' + 8 + '-' + i + '-' + 12);
        vaccineTable[fields[7].row_labels[0][i]]['Total Doses'] = totalElement.innerHTML;

        if (
          i === 0 ||
          i === 1 ||
          i === 5 ||
          i === 6 ||
          i === 9 ||
          i === 11 ||
          i === 13 ||
          i === 16 ||
          i === 17
        ) {
          var totalElement = document.getElementById('tables' + 8 + '-' + i + '-' + 14);
          vaccineTable[fields[7].row_labels[0][i]]['Administered'] = totalElement.innerHTML;
        }
      }

      var pregnantTable = data['Pregnant Women Vaccinations'];

      for (var i = 0; i < 2; i++) {
        var totalElement = document.getElementById('tables' + 9 + '-' + i + '-' + 2);
        pregnantTable[fields[8].row_labels[0][i]]['Total'] = totalElement.innerHTML;

        if (i === 0) {
          var totalElement = document.getElementById('tables' + 9 + '-' + 0 + '-' + 4);
          pregnantTable[fields[8].row_labels[0][i]]['Administered'] = totalElement.innerHTML;
        }
      }

      data.departmentId = 2;
      data['Vaccination'] = vaccineTable;
      data['Pregnant Women Vaccinations'] = pregnantTable;
      await axios
        .post('/api/report/add', data)
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.error('Something went wrong!', error.response);
        });

      reset({});
      history.goBack();
    } else {
      alert(i18n.t('departmentFormArrayInputValidationSomeFieldsContainInvalidValues'));
      window.scrollTo(0, 0);
    }
  };

  const clickPrevious = () => {
    sidePanelClick(sectionState - 1);
    window.scrollTo(0, 0);
  };

  const clickNext = () => {
    sidePanelClick(sectionState + 1);
    window.scrollTo(0, 0);
  };

  const sidePanelClick = (index: any) => {
    const currentClass = document.getElementsByClassName('list-group-item');
    let startj = 1;
    for (let i = 0; i < currentClass.length; i++) {
      currentClass[i].classList.remove('active');

      var show = 'none';
      if (i === index) {
        setSectionState(index);
        currentClass[index].classList.add('active');
        show = '';
      }

      document.getElementById('section' + i)!.style.display = show;
      for (let j = 1; j <= sections[i].section_fields.length; j++, startj++) {
        if (document.getElementById('subsection' + startj))
          document.getElementById('subsection' + startj)!.style.display = show;
        if (document.getElementById('input' + startj))
          document.getElementById('input' + startj)!.style.display = show;
        if (document.getElementById('inputs' + startj))
          document.getElementById('inputs' + startj)!.style.display = show;
      }
    }
  };

  const getRowLabel = (label: String) => {
    if (label === undefined) {
      return;
    } else {
      var newLabel = label.replaceAll('(DOT)', '.');
      return newLabel;
    }
  };

  function fixVaccination() {
    var tdElement = document.getElementById(
      'tables' + '8' + '-' + '1' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 4;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 4;
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '2' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '3' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '4' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }

    tdElement = document.getElementById(
      'tables' + '8' + '-' + '6' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 3;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 3;
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '7' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '8' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }

    tdElement = document.getElementById(
      'tables' + '8' + '-' + '9' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 2;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 2;
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '10' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }

    tdElement = document.getElementById(
      'tables' + '8' + '-' + '11' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 2;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 2;
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '12' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }

    tdElement = document.getElementById(
      'tables' + '8' + '-' + '13' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 3;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 3;
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '14' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }
    tdElement = document.getElementById(
      'tables' + '8' + '-' + '15' + '-' + '13',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }

    tdElement = document.getElementById(
      'tables' + '9' + '-' + '0' + '-' + '3',
    ) as HTMLTableCellElement;
    if (tdElement) {
      tdElement.rowSpan = 2;
      (tdElement.nextSibling as HTMLTableCellElement).rowSpan = 2;
    }
    tdElement = document.getElementById(
      'tables' + '9' + '-' + '1' + '-' + '3',
    ) as HTMLTableCellElement;
    if (tdElement) {
      (tdElement.nextSibling as HTMLTableCellElement).remove();
      tdElement.remove();
    }
  }

  //
  // VALIDATION FUNCTIONS
  //
  function submitValidation() {
    var isFormValid = true;

    for (let i = 1; i <= fields.length; i++) {
      var field = fields[i - 1];
      if (field.field_type === 'table') {
        for (var idx = 0; idx < field.total_rows; idx++) {
          for (var jdx = 0; jdx < field.total_cols; jdx++) {
            if (field.invalid_inputs[idx][jdx] == 0) {
              var inputElement = document.getElementById('tables' + i + '-' + idx + '-' + jdx)
                ?.childNodes[0] as HTMLInputElement;
              isFormValid = isValid(inputElement) && isFormValid;
            }
          }
        }
      }
    }

    return isFormValid;
  }

  function checkSideBar() {
    const listGroup = document.getElementsByClassName('list-group-item');
    let num = 1;
    for (let i = 0; i < listGroup.length; i++) {
      var section = sections[i];

      var isSectionValid = true;
      for (let j = 1; j <= section.section_fields.length; j++, num++) {
        var field = fields[num - 1];

        if (field.field_type === 'table') {
          for (var idx = 0; idx < field.total_rows; idx++) {
            for (var jdx = 0; jdx < field.total_cols; jdx++) {
              var inputElement = document.getElementById('tables' + num + '-' + idx + '-' + jdx)
                ?.childNodes[0] as HTMLInputElement;
              if (
                field.invalid_inputs[idx][jdx] === 0 &&
                inputElement.classList.contains('is-invalid')
              ) {
                isSectionValid = false;
              }
            }
          }
        } else {
          var inputElement = document.getElementById('inputs' + num)
            ?.childNodes[0] as HTMLInputElement;
          if (inputElement.classList.contains('is-invalid')) {
            isSectionValid = false;
          }
        }
      }

      var listElement = listGroup[i];
      if (isSectionValid) {
        if (listElement.childElementCount > 1) {
          listElement.removeChild(listElement.childNodes[1]);
        }
      } else {
        if (listElement.childElementCount > 1) {
          listElement.removeChild(listElement.childNodes[1]);
        }
        var alertIcon = document.createElement('div');
        alertIcon.classList.add('bi', 'bi-exclamation-circle-fill', 'flex-shrink-0', 'ms-2');
        listElement.appendChild(alertIcon);
      }
    }
  }

  function removeValidity(inputElement: HTMLInputElement) {
    var errorMessage = inputElement.nextSibling as HTMLElement;
    inputElement.classList.remove('is-invalid');
    inputElement.classList.remove('is-valid');
    errorMessage.innerHTML = '';
  }

  function makeValidity(inputElement: HTMLInputElement, isVal: boolean, msg: string) {
    var errorMessage = inputElement.nextSibling as HTMLElement;

    if (isVal) {
      inputElement.classList.remove('is-invalid');
      inputElement.classList.add('is-valid');
      errorMessage.innerHTML = '';
    } else {
      inputElement.classList.remove('is-valid');
      inputElement.classList.add('is-invalid');
      errorMessage.innerHTML = msg;
    }

    checkSideBar();
  }

  function isValid(inputElement: HTMLInputElement) {
    var numberAsText = inputElement.value;
    if (numberAsText == '') {
      makeValidity(inputElement, false, i18n.t('departmentFormInputValidationMustEnterValue'));
      return false;
    }

    var number = Number(numberAsText);
    if (number < 0) {
      makeValidity(inputElement, false, i18n.t('departmentFormInputValidationPositiveNumberOnly'));
      return false;
    }

    if (number % 1 != 0) {
      makeValidity(inputElement, false, i18n.t('departmentFormInputValidationIntegersOnly'));
      return false;
    }

    makeValidity(inputElement, true, '');
    return true;
  }

  function tableInputValidation(num: number, idx: number, jdx: number) {
    // console.log(num, idx, jdx);
    // console.log("tables" + num + idx + jdx);
    var inputElement = document.getElementById('tables' + num + '-' + idx + '-' + jdx)
      ?.childNodes[0] as HTMLInputElement;
    if (!isValid(inputElement)) return;

    // Vaccination
    if (num === 8) {
      var grandTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 18; i++) {
        var rowTotal = 0;
        for (var j = 0; j < 12; j += 3) {
          var total = 0;
          var inputElement1 = document.getElementById('tables' + num + '-' + i + '-' + j)
            ?.childNodes[0] as HTMLInputElement;
          if (inputElement1) {
            total += Number(inputElement1.value);
          }
          var inputElement2 = document.getElementById('tables' + num + '-' + i + '-' + (j + 1))
            ?.childNodes[0] as HTMLInputElement;
          if (inputElement2) {
            total += Number(inputElement2.value);
          }

          if (inputElement1 || inputElement2) {
            var totalElement = document.getElementById('tables' + num + '-' + i + '-' + (j + 2));
            totalElement.innerHTML = String(total);
            rowTotal += total;
          }
        }

        var totalElement = document.getElementById('tables' + num + '-' + i + '-' + 12);
        totalElement.innerHTML = String(rowTotal);
        grandTotals[i] = rowTotal;
      }

      var totalElement = document.getElementById('tables' + num + '-' + 0 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[0]);

      totalElement = document.getElementById('tables' + num + '-' + 1 + '-' + 14);
      totalElement.innerHTML = String(
        grandTotals[1] + grandTotals[2] + grandTotals[3] + grandTotals[4],
      );

      totalElement = document.getElementById('tables' + num + '-' + 5 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[5]);

      totalElement = document.getElementById('tables' + num + '-' + 6 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[6] + grandTotals[7] + grandTotals[8]);

      totalElement = document.getElementById('tables' + num + '-' + 9 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[9] + grandTotals[10]);

      totalElement = document.getElementById('tables' + num + '-' + 11 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[11] + grandTotals[12]);

      totalElement = document.getElementById('tables' + num + '-' + 13 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[13] + grandTotals[14] + grandTotals[15]);

      totalElement = document.getElementById('tables' + num + '-' + 16 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[16]);

      totalElement = document.getElementById('tables' + num + '-' + 17 + '-' + 14);
      totalElement.innerHTML = String(grandTotals[17]);

      return;
    } else if (num === 9) {
      var grandTotals = [0, 0];
      for (var i = 0; i < 2; i++) {
        var rowTotal = 0;
        var inputElement1 = document.getElementById('tables' + num + '-' + i + '-' + 0)
          ?.childNodes[0] as HTMLInputElement;
        if (inputElement1) {
          rowTotal += Number(inputElement1.value);
        }
        var inputElement2 = document.getElementById('tables' + num + '-' + i + '-' + 1)
          ?.childNodes[0] as HTMLInputElement;
        if (inputElement2) {
          rowTotal += Number(inputElement2.value);
        }

        if (inputElement1 || inputElement2) {
          var totalElement = document.getElementById('tables' + num + '-' + i + '-' + 2);
          totalElement.innerHTML = String(rowTotal);
        }

        grandTotals[i] = rowTotal;
      }

      var totalElement = document.getElementById('tables' + num + '-' + 0 + '-' + 4);
      totalElement.innerHTML = String(grandTotals[0] + grandTotals[1]);

      return;
    }

    makeValidity(inputElement, true, '');
  }

  let fieldCount = 0;

  document.body.classList.add('bg-light');

  return (
    <div className="form">
      <SideBar />

      <main className="container">
        <Header />

        <div className="d-flex justify-content-start">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              history.goBack();
            }}
          >
            {t('departmentAddBack')}
          </button>
        </div>

        <div className="py-3 text-start">
          {/* <h2>NICU/Paediatrics Form</h2> */}
          <span className="lead">{t('departmentAddDate')} </span>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option selected>{t('departmentAddMonth')}</option>
            <option value="1">{t('departmentAddJanuary')}</option>
            <option value="2">{t('departmentAddFebruary')}</option>
            <option value="3">{t('departmentAddMarch')}</option>
            <option value="4">{t('departmentAddApril')}</option>
            <option value="5">{t('departmentAddMay')}</option>
            <option value="6">{t('departmentAddJune')}</option>
            <option value="7">{t('departmentAddJuly')}</option>
            <option value="8">{t('departmentAddAugust')}</option>
            <option value="9">{t('departmentAddSeptember')}</option>
            <option value="10">{t('departmentAddOctober')}</option>
            <option value="11">{t('departmentAddNovember')}r</option>
            <option value="12">{t('departmentAddDecember')}</option>
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', display: 'inline-block' }}
          >
            <option selected>{t('departmentAddYear')}</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
          </select>
        </div>

        <div className="mb-3 text-start sticky-top bg-light">
          <h4 className="text-primary">Steps: </h4>
          <ul className="list-group list-group-horizontal">
            {sections
              ? sections.map((section: any, idx: any) => {
                  var isActive = idx === 0 ? true : false;
                  return (
                    <>
                      <li
                        className={
                          isActive
                            ? 'list-group-item d-flex justify-content-between active'
                            : 'list-group-item d-flex justify-content-between'
                        }
                        onClick={() => {
                          window.scrollTo(0, 0);
                          sidePanelClick(idx);
                        }}
                      >
                        <span>
                          {idx + 1}. {section.section_label}
                        </span>
                      </li>
                    </>
                  );
                })
              : null}
          </ul>
        </div>

        <div className="row g-3">
          <div className="col-sm-10 col-md-10 col-lg-9">
            <form onSubmit={handleSubmit(onSubmit)} className="needs-validation">
              <div className="row g-2">
                {sections
                  ? sections.map((section: any, idx: any) => {
                      var ret = [];

                      // render the section title
                      ret.push(
                        <h4 id={'section' + idx} className="mb-3">
                          {idx + 1}. {section.section_label}
                        </h4>,
                      );

                      var fields = section.section_fields;

                      // i is the question number
                      for (let i = fieldCount + 1; i <= fieldCount + fields.length; i++) {
                        var field = fields[i - fieldCount - 1];

                        // render the subsection title
                        if (field.subsection_label) {
                          ret.push(
                            <h6
                              id={'subsection' + i}
                              className={field.field_level === 1 ? 'px-5 fw-bold' : 'fw-bold'}
                            >
                              {field.subsection_label}
                            </h6>,
                          );
                        }

                        // render each entry
                        if (field.field_type === 'number') {
                          ret.push(
                            <>
                              <div
                                id={'input' + i}
                                className={field.field_level === 1 ? 'col-sm-10 ps-5' : 'col-sm-10'}
                              >
                                <span className="align-middle">
                                  {i}. {field.field_label}
                                </span>
                              </div>
                              <div id={'inputs' + i} className="col-sm-2">
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder=""
                                  {...register(field.field_id)}
                                  // onBlur={() => inputValidation(i)}
                                />
                                <div className="invalid-feedback">
                                  {t('departmentFormRequiresValidNumber')}
                                </div>
                              </div>
                            </>,
                          );
                        } else if (field.field_type === 'table') {
                          var count = [];
                          var k = [];
                          var inputCount = 0;
                          for (let i = 0; i < field.row_labels.length; i++) {
                            count.push(0);
                            k.push(0);
                          }
                          ret.push(
                            <>
                              <div id={'inputs' + i} style={{}}>
                                <table className="table table-bordered table-sm table table-responsive">
                                  <tbody>
                                    {/* COLUMNS */}

                                    {field.col_labels.map((row, coli) => (
                                      <tr>
                                        {field.row_labels.map((x, y) => (
                                          <td></td>
                                        ))}

                                        {row.map((col, colj) => (
                                          <th
                                            style={{ minWidth: '100px' }}
                                            className="text-center "
                                            colSpan={field.col_spans[coli][colj]}
                                            scope="colgroup"
                                          >
                                            {field.col_labels[coli][colj]}
                                          </th>
                                        ))}
                                      </tr>
                                    ))}

                                    {/* ROWS */}
                                    {[...Array(field.total_rows)].map((e, idx) => (
                                      <tr>
                                        {[...Array(field.row_labels.length)].map((e, j) => {
                                          if (count[j] === 0) {
                                            const rowLabel = getRowLabel(field.row_labels[j][k[j]]);
                                            const header = (
                                              <th
                                                className="align-middle"
                                                rowSpan={field.row_spans[j][k[j]]}
                                              >
                                                {rowLabel}
                                              </th>
                                            );
                                            count[j]++;

                                            if (count[j] === field.row_spans[j][k[j]]) {
                                              k[j]++;
                                              count[j] = 0;
                                            }

                                            return header;
                                          } else {
                                            count[j]++;

                                            if (count[j] === field.row_spans[j][k[j]]) {
                                              k[j]++;
                                              count[j] = 0;
                                            }
                                            return;
                                          }
                                        })}

                                        {/* ENTRIES */}

                                        {[...Array(field.total_cols)].map((e, j) => {
                                          var rowLength = field.row_labels.length - 1;
                                          var colLength = field.col_labels.length - 1;
                                          if (field.invalid_inputs[inputCount][j] === 1) {
                                            const dataInput = (
                                              <td
                                                id={'tables' + i + '-' + idx + '-' + j}
                                                className="text-center align-middle"
                                              >
                                                <input
                                                  type="text"
                                                  {...register(
                                                    field.subsection_label +
                                                      '.' +
                                                      field.row_labels[rowLength][inputCount] +
                                                      '.' +
                                                      field.col_labels[colLength][j],
                                                  )}
                                                  disabled
                                                />
                                              </td>
                                            );
                                            if ((j + 1) % field.total_cols === 0) {
                                              inputCount++;
                                            }
                                            return dataInput;
                                          } else {
                                            const dataInput = (
                                              <td
                                                id={'tables' + i + '-' + idx + '-' + j}
                                                className="align-middle"
                                              >
                                                <input
                                                  className="form-control"
                                                  type="text"
                                                  {...register(
                                                    field.subsection_label +
                                                      '.' +
                                                      field.row_labels[rowLength][inputCount] +
                                                      '.' +
                                                      field.col_labels[colLength][j],
                                                  )}
                                                  onBlur={() => tableInputValidation(i, idx, j)}
                                                />
                                                <div className="invalid-feedback text-end">
                                                  {t('departmentFormRequiresValidNumber')}
                                                </div>
                                              </td>
                                            );
                                            if ((j + 1) % field.total_cols === 0) {
                                              inputCount++;
                                            }
                                            return dataInput;
                                          }
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </>,
                          );
                        }
                      }

                      fieldCount += fields.length;
                      return ret;
                    })
                  : null}

                <hr className="my-4"></hr>
              </div>
            </form>

            <div className="btn-group d-flex">
              <button
                className="w-100 btn btn-secondary btn-sm"
                onClick={clickPrevious}
                disabled={sectionState === 0 ? true : false}
              >
                {t('departmentFormPrevious')}
              </button>
              <button
                className="w-100 btn btn-secondary btn-sm"
                onClick={clickNext}
                disabled={sectionState === 2 ? true : false}
              >
                {t('departmentFormNext')}
              </button>
            </div>

            <button
              className="w-100 btn btn-primary btn-lg"
              type="submit"
              style={{ display: sectionState === 2 ? '' : 'none' }}
              onClick={handleSubmit(onSubmit)}
            >
              {t('departmentFormSubmit')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CommunityForm;
