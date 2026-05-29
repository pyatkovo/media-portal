import { Component } from '@angular/core';
import { InlineTruncateDirective } from '../../directives/inline-truncate.directive';

@Component({
  selector: 'app-media-card',
  imports: [InlineTruncateDirective],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss',
  standalone: true
})
export class MediaCard {
  mediaCardTitle = 'ЗаголовокЗаголовок ЗаголовокЗаго ловок ЗагловокЗаголовокЗаголовок заг оловокс оловокс оловокс оловокс';
  mediaCardDesc = 'Мы, команда НХЛ-центр, — профессионалы с большим тренерским опытом. Уже много лет мы делаем хоккей доступным для всех желающих, с 2013 года доступны делаем хоккей доступным. Наша цель — не только улучшить мастерство каждого игрока, но и привить любовь к этому замечательному виду спорта. Мы уверены, что хоккей — это игра, которая объединяет и вдохновляет!';
}
