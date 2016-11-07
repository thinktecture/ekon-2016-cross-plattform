object MainForm: TMainForm
  Left = 0
  Top = 0
  Caption = 'Delphi App'
  ClientHeight = 471
  ClientWidth = 838
  Color = clBtnFace
  Constraints.MinHeight = 230
  Constraints.MinWidth = 382
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'Tahoma'
  Font.Style = []
  OldCreateOrder = False
  OnActivate = FormActivate
  DesignSize = (
    838
    471)
  PixelsPerInch = 96
  TextHeight = 13
  object lblSource: TLabel
    Left = 8
    Top = 164
    Width = 37
    Height = 13
    Caption = 'Source:'
  end
  object lblQuote: TLabel
    Left = 8
    Top = 69
    Width = 34
    Height = 13
    Caption = 'Quote:'
  end
  object lblId: TLabel
    Left = 8
    Top = 42
    Width = 14
    Height = 13
    Caption = 'Id:'
  end
  object lblNav: TLabel
    Left = 8
    Top = 14
    Width = 55
    Height = 13
    Caption = 'Navigation:'
  end
  object Label1: TLabel
    Left = 8
    Top = 193
    Width = 21
    Height = 13
    Caption = 'Log:'
  end
  object memQuote: TDBMemo
    Left = 72
    Top = 66
    Width = 752
    Height = 91
    Anchors = [akLeft, akTop, akRight]
    DataField = 'quote'
    DataSource = MainModule.dtsQuotes
    TabOrder = 0
  end
  object nvgQuotes: TDBNavigator
    Left = 72
    Top = 8
    Width = 230
    Height = 25
    DataSource = MainModule.dtsQuotes
    TabOrder = 1
  end
  object edtSource: TDBEdit
    Left = 72
    Top = 163
    Width = 752
    Height = 21
    Anchors = [akLeft, akTop, akRight]
    DataField = 'source'
    DataSource = MainModule.dtsQuotes
    TabOrder = 2
  end
  object edtId: TDBEdit
    Left = 72
    Top = 39
    Width = 752
    Height = 21
    Anchors = [akLeft, akTop, akRight]
    DataField = 'id'
    DataSource = MainModule.dtsQuotes
    ReadOnly = True
    TabOrder = 3
  end
  object memLog: TMemo
    Left = 72
    Top = 190
    Width = 752
    Height = 273
    Anchors = [akLeft, akTop, akRight, akBottom]
    TabOrder = 4
  end
  object btnClearLog: TButton
    Left = 8
    Top = 212
    Width = 58
    Height = 25
    Caption = 'Clear'
    TabOrder = 5
    OnClick = btnClearLogClick
  end
end
