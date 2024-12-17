import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { ClassService } from '../../../services/class/class.service';
import { TOAST } from '../../../../assets/consts';
import { FormsModule } from '@angular/forms';
import { claseInterface } from '../../../services/class/class.interface';
import { UserAuthService } from '../../../services/user-auth.service';
import { timer } from 'rxjs';
import { usuario } from '../../../services/usuario/usuario.interface';
import { AttendancesPorcentComponent } from '../attendances-porcent/attendances-porcent.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-attendances',
  standalone: true,
  imports: [ChartComponent, FormsModule, AttendancesPorcentComponent],
  templateUrl: './attendances.component.html',
  styleUrl: './attendances.component.css'
})
export class AttendancesComponent {
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  students: Array<usuario> = [];
  classId: string = "";
  classes!: Array<claseInterface>;
  studentId: string = "todos";

  constructor(private classService: ClassService,
    private userAuthService: UserAuthService
  ) {
    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: "asistencias/faltas/retardos"
        },
        min: 0
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return " " + val;
          }
        }
      }
    };
  }

  ngAfterViewInit(): void {
    const id: string = this.userAuthService.getUserId();
    this.classService.getClassesByTeacher(id).subscribe({
      next: (data) => {
        this.classes = data;
        this.classId = data[0]._id
      },
      error: (err) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al obtener las clases:\n' + err.error.message
        })
      },
      complete: () => {
        timer(500).subscribe(() => {
          this.updateChart();
        })
      }
    })
  }

  onSelectStudent(){
    if (this.studentId !== "todos") {
      this.students = this.students.filter(student => student._id === this.studentId);
    }else{
      this.getStudents();
    }
  }

  getStudents(): void {
    this.classService.getStudentsByClass(this.classId).subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al obtener los estudiantes:\n' + err.error.message
        })
      }
    })
  }

  updateChart(): void {
    this.getStudents();
    this.classService.getAttendancesChart(this.classId).subscribe({
      next: (data) => {
        this.chartOptions.series = [
          {
            name: "Asistencias",
            data: data.asistencias,
            color: "#583491"
          },
          {
            name: "Faltas",
            data: data.faltas,
            color: "#9667e0"
          },
          {
            name: "Retardos",
            data: data.retardos,
            color: "#c8aaf6"
          }
        ];
        this.chartOptions.xaxis = {
          categories: data.students
        }
      },
      error: (err) => {
        TOAST.fire({
          icon: 'error',
          title: 'Error al obtener los datos del gráfico:\n' + err.error.message
        })
      }
    })
  }
}