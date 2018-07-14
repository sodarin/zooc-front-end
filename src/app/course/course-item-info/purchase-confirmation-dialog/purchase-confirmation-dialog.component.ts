import { Component, Inject, OnInit } from '@angular/core';
import { Course } from '../../../model/Course';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { ReservationMessageComponent } from '../../trial-item-info/reservation-message/reservation-message.component';
import { OrderService } from '../../../service/order/order.service';
import { Order } from '../../../model/Order';
import {OrderStatusEnum} from '../../../model/enum/OrderStatusEnum';

@Component({
  selector: 'app-purchase-confirmation-dialog',
  templateUrl: './purchase-confirmation-dialog.component.html',
  styleUrls: ['./purchase-confirmation-dialog.component.scss']
})
export class PurchaseConfirmationDialogComponent implements OnInit {

  userId: number;
  course: Course;
  order: Order;

  constructor(private bottomSheetRef: MatBottomSheetRef<ReservationMessageComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) private data,
              private orderService$: OrderService) { }

  ngOnInit() {
    this.course = this.data.course;
    this.userId = this.data.userId;
    this.order = this.data.order;
  }

  close() {
    if (!this.order || this.order.status.toString() === OrderStatusEnum[OrderStatusEnum.CANCELED]) {
      // If there's not an order, place an order with the status of PENDING
      // If there's already an order, it can only be canceled/pending.
      // Place a new order if it's canceled
      this.orderService$.create(this.course.courseId, this.userId).subscribe(orderId => {
        this.orderService$.getDetailById(orderId).subscribe(order => {
          this.order = order;
          this.bottomSheetRef.dismiss(this.order);
        });
      });
    } else {
      // Ignore it if it's pending
      this.bottomSheetRef.dismiss(this.order);
    }
  }

  confirmPurchase() {
    if (!this.order || this.order.status.toString() === OrderStatusEnum[OrderStatusEnum.CANCELED]) {
      // If there's not an order, place an order with the status of AVAILABLE
      // If there's an order, it can only be canceled/pending
      // Place a new order and set it AVAILABLE if it's canceled
      this.orderService$.create(this.course.courseId, this.userId).subscribe(orderId => {
        this.orderService$.update(orderId, OrderStatusEnum.AVAILABLE).subscribe(() => {
          this.orderService$.getDetailById(orderId).subscribe(order => {
            this.order = order;
            this.bottomSheetRef.dismiss(this.order);
          });
        });
      });
    } else {
      // If the order is PENDING, set it to AVAILABLE
      this.orderService$.update(this.order.orderId, OrderStatusEnum.AVAILABLE).subscribe(() => {
        this.orderService$.getDetailById(this.order.orderId).subscribe(order => {
          this.order = order;
          this.bottomSheetRef.dismiss(this.order);
        });
      });
    }

  }
}
