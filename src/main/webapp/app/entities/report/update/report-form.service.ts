import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReport, NewReport } from '../report.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReport for edit and NewReportFormGroupInput for create.
 */
type ReportFormGroupInput = IReport | PartialWithRequiredKeyOf<NewReport>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReport | NewReport> = Omit<T, 'reportedTime'> & {
  reportedTime?: string | null;
};

type ReportFormRawValue = FormValueOf<IReport>;

type NewReportFormRawValue = FormValueOf<NewReport>;

type ReportFormDefaults = Pick<NewReport, 'id' | 'reportedTime'>;

type ReportFormGroupContent = {
  id: FormControl<ReportFormRawValue['id'] | NewReport['id']>;
  contentType: FormControl<ReportFormRawValue['contentType']>;
  contentID: FormControl<ReportFormRawValue['contentID']>;
  contentAuthor: FormControl<ReportFormRawValue['contentAuthor']>;
  reportedBy: FormControl<ReportFormRawValue['reportedBy']>;
  reportedTime: FormControl<ReportFormRawValue['reportedTime']>;
  reportedReason: FormControl<ReportFormRawValue['reportedReason']>;
};

export type ReportFormGroup = FormGroup<ReportFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReportFormService {
  createReportFormGroup(report: ReportFormGroupInput = { id: null }): ReportFormGroup {
    const reportRawValue = this.convertReportToReportRawValue({
      ...this.getFormDefaults(),
      ...report,
    });
    return new FormGroup<ReportFormGroupContent>({
      id: new FormControl(
        { value: reportRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      contentType: new FormControl(reportRawValue.contentType),
      contentID: new FormControl(reportRawValue.contentID),
      contentAuthor: new FormControl(reportRawValue.contentAuthor),
      reportedBy: new FormControl(reportRawValue.reportedBy),
      reportedTime: new FormControl(reportRawValue.reportedTime),
      reportedReason: new FormControl(reportRawValue.reportedReason),
    });
  }

  getReport(form: ReportFormGroup): IReport | NewReport {
    return this.convertReportRawValueToReport(form.getRawValue() as ReportFormRawValue | NewReportFormRawValue);
  }

  resetForm(form: ReportFormGroup, report: ReportFormGroupInput): void {
    const reportRawValue = this.convertReportToReportRawValue({ ...this.getFormDefaults(), ...report });
    form.reset(
      {
        ...reportRawValue,
        id: { value: reportRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReportFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      reportedTime: currentTime,
    };
  }

  private convertReportRawValueToReport(rawReport: ReportFormRawValue | NewReportFormRawValue): IReport | NewReport {
    return {
      ...rawReport,
      reportedTime: dayjs(rawReport.reportedTime, DATE_TIME_FORMAT),
    };
  }

  private convertReportToReportRawValue(
    report: IReport | (Partial<NewReport> & ReportFormDefaults)
  ): ReportFormRawValue | PartialWithRequiredKeyOf<NewReportFormRawValue> {
    return {
      ...report,
      reportedTime: report.reportedTime ? report.reportedTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
