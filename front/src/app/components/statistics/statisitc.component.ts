import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { SearchService } from "src/app/_service/comm/common.service";

@Component({
  selector: "app-statistic",
  templateUrl: "./statistic.component.html",
  styleUrls: ["./statistic.component.scss"],
})
export class StatisticComponent implements OnInit {
  enteredText: string = "";
  selectedValueToShow: number = 0;
  select: string = "user";

  @ViewChild("projectBudgetStatus") projectBudgetStatus: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) // public dialogRef: MatDialogRef<ExportPdfComponent>,
  {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.selectedValueToShow = Number(param.get("type"));
    });
  }
  searchBookBackEnd() {
    const path = this.router.url;
    const currentUrl = path.split("?")[0];
    this.router.navigate([currentUrl], {
      queryParams: {
        page: 1,
        type: this.selectedValueToShow,
        search: this.enteredText,
      },
    });
  }

  selectBook() {
    this.enteredText = "";
    this.router.navigate(["/sys/statistic/book"], {
      queryParams: { page: 1 },
    });
  }

  selectUser() {
    this.enteredText = "";
    this.router.navigate(["/sys/statistic/user"], {
      queryParams: { page: 1 },
    });
  }
  isActive(route: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes(route);
  }
  onChangeBookToShow() {
    this.enteredText = "";
    const currentUrl = this.router.url;
    this.router.navigate([currentUrl.split("?")[0]], {
      queryParams: { page: 1, type: this.selectedValueToShow },
    });
  }

  // async export1() {
  //   let fileName = this.budgetInfo.projectName + '-' + '프로젝트 예산 현황' + '.pdf';
  //   let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

  //   // set text color
  //   pdf.setTextColor(180,180,184);
  //   //set font size
  //   pdf.setFontSize(14);

  //   // pdf.setLanguage("ko-KR");

  //   // pdf.addFont('times-new-roman.woff', 'times-new-roman', 'normal');
  //   // // Set the font for the document
  //   // pdf.setFont('times-new-roman');

  //   const budgetNativeElement = this.projectBudgetStatus.nativeElement;
  //   await html2canvas(budgetNativeElement).then(async (canvas) => {
  //     let positionX = 15;
  //     let positionY = 20;
  //     let imgWidth = 180;
  //     let imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     const contentDataURL = await canvas.toDataURL('image/png');

  //     pdf.addImage(contentDataURL, 'PNG', positionX, positionY, imgWidth, imgHeight);
  //   }).catch(error => {
  //     // console.log(error);
  //   });

  //   const barChartNativeElement = this.projectBarChart.nativeElement;
  //   await html2canvas(barChartNativeElement).then(canvas => {
  //     let positionX = 15;
  //     let positionY = 140;
  //     var imgWidth = 180;
  //     var imgHeight = canvas.height * imgWidth / canvas.width;

  //     const contentDataURL = canvas.toDataURL('image/png');
  //     pdf.addImage(contentDataURL, 'PNG', positionX, positionY, imgWidth, imgHeight);
  //   });
  //   pdf.save(fileName); // Generated PDF
  //   this.dialogRef.close();
  // }

  async export() {
    console.log(1);
    let fileName = "report.pdf";
    let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF

    // set text color
    pdf.setTextColor(180, 180, 184);
    //set font size
    pdf.setFontSize(14);

    const budgetNativeElement = this.projectBudgetStatus.nativeElement;
    await html2canvas(budgetNativeElement)
      .then(async (canvas) => {
        let positionX = 15;
        let positionY = 20;
        let imgWidth = 180;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        const contentDataURL = await canvas.toDataURL("image/png");

        pdf.addImage(
          contentDataURL,
          "PNG",
          positionX,
          positionY,
          imgWidth,
          imgHeight
        );
      })
      .catch((error) => {
        // console.log(error);
      });

    pdf.save(fileName); // Generated PDF
    // this.dialogRef.close();
  }
}
