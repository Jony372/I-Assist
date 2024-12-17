import { Component, Input, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { claseInterface } from "../../../services/class/class.interface";
import { UserAuthService } from "../../../services/user-auth.service";
import { ClassService } from "../../../services/class/class.service";
import { TOAST } from "../../../../assets/consts";
import { FormsModule } from "@angular/forms";


export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-attendances-porcent',
  standalone: true,
  imports: [ChartComponent, FormsModule],
  templateUrl: './attendances-porcent.component.html',
  styleUrl: './attendances-porcent.component.css'
})
export class AttendancesPorcentComponent {
  @ViewChild("chart") chart!: ChartComponent;
  @Input() studentId!: string;
  @Input() classId!: string;
  @Input() studentName!: string;
  public chartOptions: Partial<ChartOptions>;
  classes!:Array<claseInterface> 

  constructor(private userAuthService: UserAuthService,
    private classService: ClassService
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        width: 380,
        type: "pie",
      },
      labels: ["Asistencias", "Retardos", "Faltas"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom",
            }
          }
        }
      ]
    };
  }

  ngOnInit(): void {
    const id = this.studentId || this.userAuthService.getUserId();
    this.classService.getClassesByStudent(id).subscribe({
      next: (classes) => {
        if (!this.studentId) {
          this.classes = classes;
          this.classId = classes[0]?._id
        }
      },
      error: (err) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al obtener las clases:\n' + err.error.message
        })
      },
      complete: () => this.updateChart()
    })
  }

  updateChart(){
    const id = this.studentId || this.userAuthService.getUserId();
    this.classService.getStudentAttendancesChart(this.classId,id).subscribe({
      next: (data) => {
        this.chartOptions.series = data
      },
      error: (error) => {
        TOAST.fire({
          title: "Error al obtener la clase:\n"+error.error.message,
          icon: 'error'
        })
      }
    })
  }
}