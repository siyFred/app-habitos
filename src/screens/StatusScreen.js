import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from "react-native";
import { colors_white } from "../styles/theme";
import { MOCK_HABITS } from "../mocks/mock_data.js";

const CartaoEstatistica = ({ titulo, valor, descricao }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{titulo}</Text>
    <Text style={styles.cardValue}>{valor}</Text>
    {descricao && <Text style={styles.cardDescription}>{descricao}</Text>}
  </View>
);

const CartaoDesempenhoHabito = ({ nomeHabito, porcentagem }) => {
  const animWidth = useRef(new Animated.Value(porcentagem)).current;

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: porcentagem,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [porcentagem]);

  return (
    <View style={styles.habitCard}>
      <Text style={styles.habitName}>{nomeHabito}</Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, {
          width: animWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })
        }]} />
      </View>
      <Text style={styles.habitPercentage}>{porcentagem.toFixed(0)}%</Text>
    </View>
  );
};

export default function TelaStatus() {
  const [periodoDias, setPeriodoDias] = useState(7);

  const formatarData = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const hoje = new Date();
  const hojeString = formatarData(hoje);
  const diaSemanaHoje = hoje.getDay();

  const habitosHoje = MOCK_HABITS.filter(habit => habit.frequency.includes(diaSemanaHoje));
  const totalHabitosHoje = habitosHoje.length;
  const concluidosHoje = habitosHoje.filter(habit => habit.completedDates.includes(hojeString)).length;
  const porcentagemHoje = totalHabitosHoje > 0 ? (concluidosHoje / totalHabitosHoje) * 100 : 0;

  let maiorSequencia = 0;
  MOCK_HABITS.forEach(habit => {
    let sequenciaAtual = 0;
    const sortedDates = habit.completedDates
      .map(d => {
        const parts = d.split('-').map(Number);
        return new Date(parts[0], parts[1] - 1, parts[2]);
      })
      .sort((a, b) => a - b);

    if (sortedDates.length > 0) {
      sequenciaAtual = 1;
      maiorSequencia = Math.max(maiorSequencia, sequenciaAtual);

      for (let i = 1; i < sortedDates.length; i++) {
        const diffDays = Math.round((sortedDates[i] - sortedDates[i - 1]) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          sequenciaAtual++;
        } else {
          sequenciaAtual = 1;
        }
        if (sequenciaAtual > maiorSequencia) maiorSequencia = sequenciaAtual;
      }
    }
  });

  const desempenhoHabitos = MOCK_HABITS.map(habit => {
    let diasConsiderados = 0;
    let diasConcluidos = 0;

    for (let i = 0; i < periodoDias; i++) {
      const dataVerificacao = new Date();
      dataVerificacao.setDate(hoje.getDate() - i);
      const diaSemana = dataVerificacao.getDay();

      if (habit.frequency.includes(diaSemana)) {
        diasConsiderados++;
        const dataString = formatarData(dataVerificacao);
        if (habit.completedDates.includes(dataString)) {
          diasConcluidos++;
        }
      }
    }
    const porcentagem = diasConsiderados > 0 ? (diasConcluidos / diasConsiderados) * 100 : 0;
    return { nome: habit.title, porcentagem };
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Seu Progresso</Text>

      <View style={styles.summaryGrid}>
        <CartaoEstatistica
          titulo="Progresso Hoje"
          valor={`${porcentagemHoje.toFixed(0)}%`}
          descricao={`${concluidosHoje} de ${totalHabitosHoje} hábitos`}
        />
        <CartaoEstatistica
          titulo="Maior Sequência"
          valor={`${maiorSequencia} dias`}
          descricao="Maior sequência de um hábito"
        />
      </View>

      <View style={styles.segmentedContainer} accessible accessibilityRole="tablist">
        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: periodoDias === 7 }}
          style={[styles.segmentedButton, periodoDias === 7 && styles.segmentedButtonActive]}
          onPress={() => setPeriodoDias(7)}
        >
          <Text style={[styles.segmentedText, periodoDias === 7 && styles.segmentedTextActive]}>7 dias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: periodoDias === 30 }}
          style={[styles.segmentedButton, periodoDias === 30 && styles.segmentedButtonActive]}
          onPress={() => setPeriodoDias(30)}
        >
          <Text style={[styles.segmentedText, periodoDias === 30 && styles.segmentedTextActive]}>30 dias</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="tab"
          accessibilityState={{ selected: periodoDias === 365 }}
          style={[styles.segmentedButton, periodoDias === 365 && styles.segmentedButtonActive]}
          onPress={() => setPeriodoDias(365)}
        >
          <Text style={[styles.segmentedText, periodoDias === 365 && styles.segmentedTextActive]}>Ano</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Desempenho por Hábito</Text>
      {desempenhoHabitos.map((habit, index) => (
        <CartaoDesempenhoHabito key={index} nomeHabito={habit.nome} porcentagem={habit.porcentagem} />
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors_white.text,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 22,
    fontWeight: '600',
    color: colors_white.text,
    marginTop: 30,
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 4,
    marginTop: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 26,
  },
  segmentedButtonActive: {
    backgroundColor: colors_white.primary,
  },
  segmentedText: {
    color: '#333',
    fontWeight: '600',
  },
  segmentedTextActive: {
    color: '#fff',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors_white.primary,
    marginVertical: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors_white.primary,
    borderRadius: 4,
  },
  habitPercentage: {
    fontSize: 12,
    color: '#555',
    alignSelf: 'flex-end',
  }
});
